import React from "react";

export const AdminDashboard = () => {
  return (
    <div className="flex flex-col p-4 md:p-8">
      <h1 className="text-3xl font-bold text-[var(--color-on-surface)] mb-6 mt-4">
        Панель управления
      </h1>
      <div className="bg-[var(--color-surface-container)] rounded-xl p-8 border border-[var(--color-outline-variant)] flex items-center justify-center">
        <p className="text-[var(--color-on-surface-variant)]">
          Админ-панель в разработке...
        </p>
      </div>
    </div>
  );
};
