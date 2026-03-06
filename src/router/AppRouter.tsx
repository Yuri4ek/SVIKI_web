import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { ROUTES } from "@/lib/constants/routes";
import { HomePage, LoginPage, RegistrationPage, QuizPage } from "@pages";
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
        {/* ПУБЛИЧНЫЕ МАРШРУТЫ */}
        <Route element={<PublicRoutes />}>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegistrationPage />} />
          <Route path={ROUTES.QUIZ} element={<QuizPage />} />
        </Route>

        {/* ПРИВАТНЫЕ МАРШРУТЫ */}
        <Route element={<PrivateRoutes />}>
          <Route path={ROUTES.MAIN} element={<HomePage />} />
        </Route>

        <Route path="*" element={<Navigate to={ROUTES.MAIN} replace />} />
      </Routes>
    </BrowserRouter>
  );
};
