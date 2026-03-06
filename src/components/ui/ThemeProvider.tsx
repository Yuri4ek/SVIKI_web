import React, { useEffect } from "react";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    // Функция, которая проверяет системную тему и ставит нужный класс
    const applySystemTheme = (e: MediaQueryList | MediaQueryListEvent) => {
      if (e.matches) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    // 1. Применяем тему при первой загрузке приложения
    applySystemTheme(mediaQuery);

    // 2. Добавляем слушатель, чтобы тема менялась мгновенно,
    const handleChange = (e: MediaQueryListEvent) => applySystemTheme(e);
    mediaQuery.addEventListener("change", handleChange);

    // 3. Очищаем слушатель при уничтожении компонента
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return <>{children}</>;
};
