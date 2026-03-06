import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { ROUTES } from "@/lib/constants/routes";
import { HomePage, LoginPage, RegistrationPage } from "@pages";
import { useUserStore } from "@/lib/store";

const PrivateRoutes = () => {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  return isLoggedIn ? <Outlet /> : <Navigate to={ROUTES.LOGIN} replace />;
};

const PublicRoutes = () => {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  return !isLoggedIn ? <Outlet /> : <Navigate to={ROUTES.MAIN} replace />;
};

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ПУБЛИЧНЫЕ МАРШРУТЫ (Доступны только если НЕ авторизован) */}
        <Route element={<PublicRoutes />}>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegistrationPage />} />
          <Route
            path={ROUTES.VERIFICATION}
            element={<div>Verification Page</div>}
          />
        </Route>

        {/* ПРИВАТНЫЕ МАРШРУТЫ (Доступны только после авторизации) */}
        <Route element={<PrivateRoutes />}>
          <Route path={ROUTES.MAIN} element={<HomePage />} />
          <Route path={ROUTES.QUIZ} element={<div>Quiz Page</div>} />
        </Route>

        {/* Обработка несуществующих маршрутов (404) */}
        <Route path="*" element={<Navigate to={ROUTES.MAIN} replace />} />
      </Routes>
    </BrowserRouter>
  );
};
