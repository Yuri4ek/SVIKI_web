import { RoleGuard, ClientDashboard, AdminDashboard } from "@/components";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[var(--color-background)] font-sans">
      <RoleGuard
        client={<ClientDashboard />}
        admin={<AdminDashboard />}
        manager={<AdminDashboard />}
        // Агент и Юрист пока без компонентов -> сработает авто-заглушка
      />
    </div>
  );
};

export default HomePage;
