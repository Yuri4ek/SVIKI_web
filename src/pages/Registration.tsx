import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/lib/constants";
import {
  UserRole,
  useUserStore,
  useOnboardingStore,
  RoleDisplay,
  RoleTranslation,
  REGISTRATION_ROLES_UI,
} from "@/lib/store";
import { authService } from "@/lib/api";
import { authStyles } from "@/styles";
import { ChevronDown, Check } from "lucide-react";

export function RegistrationPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>("Client");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [isRolePickerOpen, setIsRolePickerOpen] = useState(false);

  const roles = REGISTRATION_ROLES_UI;
  const login = useUserStore((state) => state.login);
  const setRegData = useOnboardingStore((state) => state.setRegData);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = identifier.replace(/\D/g, "");

    if (!role) return alert("Выберите роль");
    if (!cleanPhone || !password || !confirmPassword)
      return alert("Заполните все поля");
    if (password !== confirmPassword) return alert("Пароли не совпадают");
    if (!agreementAccepted) return alert("Примите соглашение");

    if (role === "Client") {
      setRegData({ phone: cleanPhone, password, role });
      navigate(ROUTES.QUIZ);
      return;
    }

    try {
      await authService.register(Number(cleanPhone), password, role);
      const loginResponse = await authService.login(cleanPhone, password);
      login(loginResponse.role as UserRole);
      navigate(ROUTES.MAIN);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Ошибка регистрации";
      alert(
        typeof errorMessage === "string" ? errorMessage : "Что-то пошло не так",
      );
    }
  };

  return (
    <div className={authStyles.wrapper}>
      <div className={authStyles.container}>
        <h1 className={authStyles.title}>Добро пожаловать в SVIKI</h1>

        <form onSubmit={handleRegister} className="w-full flex flex-col">
          {/* Custom Role Dropdown */}
          <div className={`${authStyles.inputWrapper} z-20`}>
            <div
              className={authStyles.selectBox}
              onClick={() => setIsRolePickerOpen(!isRolePickerOpen)}
              tabIndex={0}
              onBlur={() => setTimeout(() => setIsRolePickerOpen(false), 150)} // Задержка для клика по элементу
            >
              <span
                style={{
                  color: role
                    ? "var(--color-on-surface)"
                    : "var(--color-on-surface-variant)",
                }}
              >
                {role ? `Роль: ${RoleDisplay[role]}` : "Выберите роль"}
              </span>
              <ChevronDown size={20} color="var(--color-icon)" />
            </div>

            {isRolePickerOpen && (
              <ul className={authStyles.dropdown}>
                {roles.map((item) => (
                  <li
                    key={item}
                    className={authStyles.dropdownItem}
                    onClick={() => {
                      setRole(RoleTranslation[item]);
                      setIsRolePickerOpen(false);
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={authStyles.inputWrapper}>
            <input
              className={authStyles.input}
              type="text"
              placeholder="Телефон"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoCapitalize="none"
              required
            />
          </div>

          <div className={authStyles.inputWrapper}>
            <input
              className={authStyles.input}
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className={authStyles.inputWrapper}>
            <input
              className={authStyles.input}
              type="password"
              placeholder="Повторите пароль"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <label className={authStyles.checkboxContainer}>
            <input
              type="checkbox"
              className="hidden"
              checked={agreementAccepted}
              onChange={() => setAgreementAccepted(!agreementAccepted)}
            />
            <div
              className={`${authStyles.checkbox} ${agreementAccepted ? authStyles.checkboxChecked : ""}`}
            >
              {agreementAccepted && (
                <Check size={16} color="var(--color-background)" />
              )}
            </div>
            <span className={authStyles.checkboxText}>
              Принимаю пользовательское соглашение
            </span>
          </label>

          <button type="submit" className={authStyles.mainButton}>
            Далее к анкете
          </button>
        </form>

        <div className={authStyles.rowButtons}>
          <button
            type="button"
            className={authStyles.secondaryButton}
            onClick={() => navigate(ROUTES.LOGIN)}
          >
            Уже есть аккаунт?
          </button>
        </div>
      </div>
    </div>
  );
}
