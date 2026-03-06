import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/lib/constants";
import { UserRole, useUserStore } from "@/lib/store";
import { authService } from "@/lib/api";
import { authStyles } from "@/styles";
import { Check } from "lucide-react";

export function LoginPage() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const login = useUserStore((state) => state.login);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (identifier !== "" && password !== "") {
      try {
        const loginResponse = await authService.login(identifier, password);
        const serverRole = loginResponse.role as UserRole;
        login(serverRole);
        navigate(ROUTES.MAIN);
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Ошибка авторизации";
        alert(
          typeof errorMessage === "string"
            ? errorMessage
            : "Что-то пошло не так",
        );
      }
    } else {
      alert("Неверные данные");
    }
  };

  return (
    <div className={authStyles.wrapper}>
      <div className={authStyles.container}>
        <h1 className={authStyles.title}>С возвращением в SVIKI</h1>

        <form onSubmit={handleLogin} className="w-full flex flex-col">
          <div className={authStyles.inputWrapper}>
            <input
              className={authStyles.input}
              type="text"
              placeholder="Почта или телефон"
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

          <label className={authStyles.checkboxContainer}>
            <input
              type="checkbox"
              className="hidden"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <div
              className={`${authStyles.checkbox} ${rememberMe ? authStyles.checkboxChecked : ""}`}
            >
              {rememberMe && (
                <Check size={16} color="var(--color-background)" />
              )}
            </div>
            <span className={authStyles.checkboxText}>Запомнить меня</span>
          </label>

          <button type="submit" className={authStyles.mainButton}>
            Войти
          </button>
        </form>

        <div className={authStyles.rowButtons}>
          <button
            type="button"
            className={authStyles.secondaryButton}
            onClick={() => navigate(ROUTES.REGISTER)}
          >
            Регистрация
          </button>
        </div>
      </div>
    </div>
  );
}
