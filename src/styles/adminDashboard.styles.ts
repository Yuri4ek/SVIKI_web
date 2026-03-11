export const adminDashboardStyles = {
  wrapper: "flex flex-col p-4 md:p-8 max-w-3xl mx-auto w-full pb-20",
  header: "text-3xl font-bold text-[var(--color-on-surface)] mb-6 mt-4",
  sectionTitle:
    "text-xl font-semibold text-[var(--color-on-surface)] mb-3 mt-6 ml-2",

  card: "bg-[var(--color-surface-container)] rounded-xl p-4 md:p-6 mb-3 border border-[var(--color-outline-variant)]",

  // Поля поиска
  label: "text-sm text-[var(--color-on-surface-variant)] mb-2 block",
  searchRow: "flex items-center gap-2 mb-3",
  searchInput:
    "flex-1 h-12 bg-[var(--color-surface-container-high)] rounded-xl px-4 text-base text-[var(--color-on-surface)] placeholder-[var(--color-on-surface-variant)] outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all",
  searchButton:
    "bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)] px-5 h-12 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center cursor-pointer",
  successText:
    "text-[var(--color-primary)] text-sm mb-5 font-medium flex items-center gap-1",

  // Форма регистрации менеджера
  formRow:
    "flex justify-between items-center py-3 border-b border-[var(--color-outline-variant)] last:border-0",
  formLabel: "text-sm text-[var(--color-on-surface-variant)] flex-1",
  formInput:
    "flex-[2] bg-transparent text-right text-base text-[var(--color-on-surface)] placeholder-[var(--color-on-surface-variant)] outline-none focus:text-[var(--color-primary)] transition-colors",

  // Кнопки
  mainButton:
    "w-full h-14 bg-[var(--color-primary)] text-[var(--color-on-primary)] rounded-xl flex justify-center items-center mt-6 shadow-sm hover:opacity-90 transition-opacity text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed",
  secondaryButton:
    "w-full h-12 bg-[var(--color-surface-variant)] text-[var(--color-on-surface-variant)] rounded-xl flex justify-center items-center mt-4 font-bold hover:opacity-90 transition-opacity cursor-pointer",

  // Модальные окна и списки
  modalOverlay:
    "fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4",
  modalContent:
    "bg-[var(--color-background)] rounded-2xl p-6 w-full max-w-md shadow-xl flex flex-col max-h-[80vh]",
  listContainer: "flex-1 overflow-y-auto mt-2 pr-2 custom-scrollbar",
  listItem:
    "py-4 border-b border-[var(--color-outline-variant)] last:border-b-0 cursor-pointer hover:bg-[var(--color-surface-container-highest)] transition-colors px-2 rounded-lg",
  listItemTitle: "text-[var(--color-on-surface)] text-base font-bold",
  listItemSub: "text-[var(--color-on-surface-variant)] text-sm mt-1",
  emptyText: "text-center mt-8 text-[var(--color-on-surface-variant)]",

  // Спиннеры (замена ActivityIndicator)
  spinner:
    "w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin",
  spinnerPrimary:
    "w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto my-8",
};
