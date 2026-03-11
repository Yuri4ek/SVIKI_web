import { useState, useEffect } from "react";
import {
  clientService,
  mapDtoToDashboard,
  ClientDashboardData,
} from "@/lib/api";
import { clientDashboardStyles as styles } from "@/styles";

export const ClientDashboard = () => {
  const [data, setData] = useState<ClientDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const dto = await clientService.getQuestionnaire();
      setData(mapDtoToDashboard(dto));
    } catch (error) {
      console.error("Ошибка загрузки анкеты в дашборде", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading || !data) {
    return (
      <div className={styles.loaderWrapper}>
        <div className={styles.loader}></div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerContainer}>
        <h1 className={styles.title}>СВИКИ</h1>
      </div>

      <h2 className={styles.sectionTitle}>Кредитный рейтинг</h2>
      <div
        className={styles.cardInteractive}
        onClick={() => setShowHistory(true)}
      >
        <div className={styles.scoreGrid}>
          <div className={styles.scoreItem}>
            <span className={styles.scoreValue}>{data.creditScoreNBKI}</span>
            <span className={styles.scoreLabel}>НБКИ</span>
          </div>
          <div className={styles.scoreItem}>
            <span className={styles.scoreValue}>{data.creditScoreOKB}</span>
            <span className={styles.scoreLabel}>ОКБ</span>
          </div>
        </div>
        <p className={styles.scoreHint}>Нажмите для просмотра динамики</p>
      </div>

      <h2 className={styles.sectionTitle}>Транспорт</h2>
      <div className={styles.card}>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Авто в собственности</span>
          <span className={styles.rowValue}>{data.car?.answer || "Нет"}</span>
        </div>
        {data.car?.answer === "Да" && (
          <div className={styles.row}>
            <span className={styles.rowLabel}>Стоимость</span>
            <span className={styles.rowValue}>{data.car?.details}</span>
          </div>
        )}
        <div className={styles.rowLast}>
          <span className={styles.rowLabel}>Автокредит</span>
          <span className={styles.rowValue}>
            {data.carLoan?.answer || "Нет"}{" "}
            {data.carLoan?.answer === "Да" && data.carLoan?.details
              ? `(${data.carLoan.details})`
              : ""}
          </span>
        </div>
      </div>

      {showHistory && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowHistory(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className={styles.modalTitle}>Динамика рейтинга</h2>
            <div className="my-4">
              <div className={styles.rowLast}>
                <span className={styles.rowLabel}>Текущий месяц</span>
                <span className={styles.rowValue}>Нет данных</span>
              </div>
            </div>
            <button
              className={styles.modalButton}
              onClick={() => setShowHistory(false)}
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
