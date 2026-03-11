import { useState, useEffect } from "react";
import { usersService, clientService } from "@/lib/api";
import { UserBase } from "@lib/api";
import { api } from "@/lib/api";
import { adminDashboardStyles as styles } from "@/styles";

export const AdminDashboard = () => {
  // Стейты регистрации менеджера
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoadingManager, setIsLoadingManager] = useState(false);

  // --- СТЕЙТЫ: ПРИВЯЗКА КЛИЕНТА ---
  const [clientSearch, setClientSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<UserBase | null>(null);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [clientResults, setClientResults] = useState<UserBase[]>([]);
  const [isSearchingClients, setIsSearchingClients] = useState(false);

  // --- СТЕЙТЫ: ПРИВЯЗКА ЮРИСТА ---
  const [lawyerSearch, setLawyerSearch] = useState("");
  const [selectedLawyer, setSelectedLawyer] = useState<UserBase | null>(null);
  const [isLawyerModalOpen, setIsLawyerModalOpen] = useState(false);
  const [lawyerResults, setLawyerResults] = useState<UserBase[]>([]);
  const [isSearchingLawyers, setIsSearchingLawyers] = useState(false);

  const [isAssigning, setIsAssigning] = useState(false);

  // Эффект поиска клиентов
  useEffect(() => {
    if (!isClientModalOpen) return;
    const timer = setTimeout(async () => {
      setIsSearchingClients(true);
      try {
        const res = await usersService.getManagerClients(1, 30, clientSearch);
        setClientResults(res.value);
      } catch (e) {
        console.error("Ошибка поиска клиентов", e);
      } finally {
        setIsSearchingClients(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [clientSearch, isClientModalOpen]);

  // Эффект поиска юристов
  useEffect(() => {
    if (!isLawyerModalOpen) return;
    const timer = setTimeout(async () => {
      setIsSearchingLawyers(true);
      try {
        const res = await usersService.getManagerLawyers(1, 30, lawyerSearch);
        setLawyerResults(res.value);
      } catch (e) {
        console.error("Ошибка поиска юристов", e);
      } finally {
        setIsSearchingLawyers(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [lawyerSearch, isLawyerModalOpen]);

  // Сохранение привязки
  const handleAssignLawyer = async () => {
    if (!selectedClient || !selectedLawyer) {
      window.alert(
        "Внимание: Пожалуйста, выберите и клиента, и юриста из списков.",
      );
      return;
    }

    setIsAssigning(true);
    try {
      let clientId = selectedClient.originalId;

      if (!clientId) {
        const clientRes = await api.get(`/manager/client/${selectedClient.id}`);
        clientId = clientRes.data?.clientId;
      }

      if (!clientId) {
        throw new Error(
          "Не удалось найти профиль клиента (ClientId) для этого пользователя.",
        );
      }

      const lawyerListRes = await api.get(
        `/client/lawyer-selectlist/${clientId}`,
      );
      const lawyerList = lawyerListRes.data?.selectList || [];

      const matchedLawyer = lawyerList.find(
        (l: any) => l.text === selectedLawyer.name,
      );

      if (!matchedLawyer) {
        throw new Error(
          "Не удалось найти LawyerId. Возможно, этот пользователь не заведен в таблицу юристов.",
        );
      }

      const lawyerId = matchedLawyer.value;
      await clientService.selectLawyer(clientId, lawyerId);

      window.alert("Успех: Юрист успешно привязан к клиенту!");

      setSelectedClient(null);
      setSelectedLawyer(null);
      setClientSearch("");
      setLawyerSearch("");
    } catch (e: any) {
      console.error("Ошибка привязки:", e.response?.data || e.message || e);
      window.alert(
        `Ошибка: ${typeof e.response?.data === "string" ? e.response.data : e.message || "Не удалось сохранить привязку."}`,
      );
    } finally {
      setIsAssigning(false);
    }
  };

  // Регистрация менеджера
  const handleAddManager = async () => {
    if (!name || !email || !phone || !password) {
      window.alert("Ошибка: Пожалуйста, заполните все поля");
      return;
    }
    try {
      setIsLoadingManager(true);
      await usersService.addManager({
        name: name.trim(),
        email: email.trim(),
        phone: Number(phone),
        password,
      });
      window.alert("Успех: Менеджер успешно зарегистрирован в системе");
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
    } catch (error: any) {
      window.alert(
        `Ошибка: ${error?.response?.data?.message || "Не удалось добавить менеджера."}`,
      );
    } finally {
      setIsLoadingManager(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.header}>СВИКИ - Панель</h1>

      {/* ========================================== */}
      {/* СЕКЦИЯ ПРИВЯЗКИ ЮРИСТА К КЛИЕНТУ           */}
      {/* ========================================== */}
      <h2 className={styles.sectionTitle}>Привязка юриста к клиенту</h2>
      <div className={styles.card}>
        {/* Поле Клиента */}
        <span className={styles.label}>Клиент (ФИО или номер):</span>
        <div className={styles.searchRow}>
          <input
            className={styles.searchInput}
            placeholder="Введите данные..."
            value={clientSearch}
            onChange={(e) => {
              setClientSearch(e.target.value);
              if (selectedClient) setSelectedClient(null);
            }}
          />
          <button
            className={styles.searchButton}
            onClick={() => setIsClientModalOpen(true)}
          >
            Найти
          </button>
        </div>
        {selectedClient && (
          <p className={styles.successText}>
            ✅ Выбран: {selectedClient.name} (+{selectedClient.phone})
          </p>
        )}

        {/* Поле Юриста */}
        <span className={`${styles.label} ${selectedClient ? "mt-0" : "mt-3"}`}>
          Юрист (ФИО или номер):
        </span>
        <div className={styles.searchRow}>
          <input
            className={styles.searchInput}
            placeholder="Введите данные..."
            value={lawyerSearch}
            onChange={(e) => {
              setLawyerSearch(e.target.value);
              if (selectedLawyer) setSelectedLawyer(null);
            }}
          />
          <button
            className={styles.searchButton}
            onClick={() => setIsLawyerModalOpen(true)}
          >
            Найти
          </button>
        </div>
        {selectedLawyer && (
          <p className={styles.successText}>
            ✅ Выбран: {selectedLawyer.name} (+{selectedLawyer.phone})
          </p>
        )}

        <button
          className={styles.mainButton}
          onClick={handleAssignLawyer}
          disabled={!selectedClient || !selectedLawyer || isAssigning}
        >
          {isAssigning ? (
            <div className={styles.spinner}></div>
          ) : (
            "Сохранить привязку"
          )}
        </button>
      </div>

      {/* ========================================== */}
      {/* СЕКЦИЯ РЕГИСТРАЦИИ МЕНЕДЖЕРА               */}
      {/* ========================================== */}
      <h2 className={styles.sectionTitle}>Регистрация Менеджера</h2>
      <div className={styles.card}>
        <div className={styles.formRow}>
          <span className={styles.formLabel}>Юзернейм</span>
          <input
            className={styles.formInput}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Имя менеджера"
          />
        </div>
        <div className={styles.formRow}>
          <span className={styles.formLabel}>Email</span>
          <input
            className={styles.formInput}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="manager@mail.ru"
            type="email"
          />
        </div>
        <div className={styles.formRow}>
          <span className={styles.formLabel}>Телефон</span>
          <input
            className={styles.formInput}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="79001234567"
            type="tel"
          />
        </div>
        <div className={styles.formRow}>
          <span className={styles.formLabel}>Пароль</span>
          <input
            className={styles.formInput}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••"
            type="password"
          />
        </div>
        <button
          className={styles.mainButton}
          onClick={handleAddManager}
          disabled={isLoadingManager}
        >
          {isLoadingManager ? (
            <div className={styles.spinner}></div>
          ) : (
            "Зарегистрировать"
          )}
        </button>
      </div>

      {/* ========================================== */}
      {/* МОДАЛЬНЫЕ ОКНА                             */}
      {/* ========================================== */}

      {/* ОКНО ВЫБОРА КЛИЕНТА */}
      {isClientModalOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setIsClientModalOpen(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className={`${styles.sectionTitle} !mt-0 !ml-0`}>
              Выбор клиента
            </h2>
            <input
              className={styles.searchInput}
              placeholder="Введите ФИО или телефон..."
              value={clientSearch}
              onChange={(e) => setClientSearch(e.target.value)}
              autoFocus
            />
            <div className={styles.listContainer}>
              {isSearchingClients ? (
                <div className={styles.spinnerPrimary}></div>
              ) : clientResults.length > 0 ? (
                clientResults.map((item) => (
                  <div
                    key={item.id}
                    className={styles.listItem}
                    onClick={() => {
                      setSelectedClient(item);
                      setClientSearch(item.name);
                      setIsClientModalOpen(false);
                    }}
                  >
                    <p className={styles.listItemTitle}>{item.name}</p>
                    <p className={styles.listItemSub}>+{item.phone}</p>
                  </div>
                ))
              ) : (
                <p className={styles.emptyText}>Ничего не найдено</p>
              )}
            </div>
            <button
              className={styles.secondaryButton}
              onClick={() => setIsClientModalOpen(false)}
            >
              Закрыть
            </button>
          </div>
        </div>
      )}

      {/* ОКНО ВЫБОРА ЮРИСТА */}
      {isLawyerModalOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setIsLawyerModalOpen(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className={`${styles.sectionTitle} !mt-0 !ml-0`}>
              Выбор юриста
            </h2>
            <input
              className={styles.searchInput}
              placeholder="Введите ФИО или телефон..."
              value={lawyerSearch}
              onChange={(e) => setLawyerSearch(e.target.value)}
              autoFocus
            />
            <div className={styles.listContainer}>
              {isSearchingLawyers ? (
                <div className={styles.spinnerPrimary}></div>
              ) : lawyerResults.length > 0 ? (
                lawyerResults.map((item) => (
                  <div
                    key={item.id}
                    className={styles.listItem}
                    onClick={() => {
                      setSelectedLawyer(item);
                      setLawyerSearch(item.name);
                      setIsLawyerModalOpen(false);
                    }}
                  >
                    <p className={styles.listItemTitle}>{item.name}</p>
                    <p className={styles.listItemSub}>+{item.phone}</p>
                  </div>
                ))
              ) : (
                <p className={styles.emptyText}>Ничего не найдено</p>
              )}
            </div>
            <button
              className={styles.secondaryButton}
              onClick={() => setIsLawyerModalOpen(false)}
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
