import React from "react";
import { useUserStore } from "@/lib/store";

interface RoleGuardProps {
  client?: React.ReactNode;
  admin?: React.ReactNode;
  manager?: React.ReactNode;
  agent?: React.ReactNode;
  lawyer?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  client,
  admin,
  manager,
  agent,
  lawyer,
}) => {
  const role = useUserStore((state) => state.role);

  switch (role) {
    case "Client":
      return <>{client}</>;
    case "Admin":
      return <>{admin}</>;
    case "Manager":
      return <>{manager}</>;
    case "Agent":
      return <>{agent || <FallbackDashboard role="Агент" />}</>;
    case "Lawyer":
      return <>{lawyer || <FallbackDashboard role="Юрист" />}</>;
    default:
      return <div>Неизвестная роль</div>;
  }
};

const FallbackDashboard = ({ role }: { role: string }) => (
  <div className="flex h-full items-center justify-center p-6">
    <p className="text-[var(--color-on-surface-variant)] text-lg">
      Панель для роли «{role}» находится в разработке.
    </p>
  </div>
);
