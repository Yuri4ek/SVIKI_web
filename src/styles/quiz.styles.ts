export const quizStyles = {
  container:
    "min-h-screen bg-background flex flex-col relative text-surface-on",
  contentContainer: "flex-1 p-4 pb-32 max-w-3xl mx-auto w-full",

  // Карточки вопросов
  card: "bg-surface-container rounded-3xl p-6 mb-4 shadow-none transition-all",
  cardChild:
    "ml-4 md:ml-8 bg-surface-container/50 border-l-2 border-primary/20",
  questionText: "text-lg font-semibold mb-4 text-surface-on leading-normal",
  optionsContainer: "flex flex-col gap-2",

  // Кнопки вариантов ответа
  optionButton:
    "w-full text-left py-4 px-5 rounded-2xl transition-all duration-200",
  optionUnselected:
    "bg-surface-container-high text-surface-on-variant hover:bg-surface-variant",
  optionSelected:
    "bg-primary text-primary-on font-bold shadow-lg shadow-primary/20",

  // Подвал
  footer:
    "fixed bottom-0 left-0 right-0 p-6 bg-surface/80 backdrop-blur-md border-t border-outline-variant/20 flex justify-center z-10",
  footerInner: "max-w-3xl w-full",

  // Кнопка отправки
  submitButton:
    "w-full py-4 rounded-2xl flex items-center justify-center transition-all duration-200",
  submitButtonDisabled:
    "bg-surface-variant text-surface-on-variant opacity-50 cursor-not-allowed",
  submitButtonEnabled: "bg-primary text-primary-on hover:brightness-110",
  submitButtonText: "text-base font-bold",

  // Спиннер
  spinner: "animate-spin h-6 w-6 text-primary-on",
  spinnerCircle: "opacity-25",
  spinnerPath: "opacity-75",
} as const;
