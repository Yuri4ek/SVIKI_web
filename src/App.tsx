import { useEffect } from "react";
import { AppRouter } from "./router/AppRouter";
import { useUserStore } from "@/lib/store";

function App() {
  const checkAuth = useUserStore((state) => state.checkAuth);
  const isAuthChecking = useUserStore((state) => state.isAuthChecking);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isAuthChecking) {
    return (
      <div
        style={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Загрузка приложения...
      </div>
    );
  }

  return <AppRouter />;
}

export default App;
