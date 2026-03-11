export const clientDashboardStyles = {
  loaderWrapper: "flex min-h-[50vh] items-center justify-center",
  loader:
    "w-10 h-10 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin",

  wrapper: "flex flex-col p-4 md:p-8 max-w-3xl mx-auto w-full pb-20",
  headerContainer: "flex justify-between items-center mt-4 mb-2",
  title: "text-3xl font-bold text-[var(--color-on-surface)]",
  sectionTitle:
    "text-xl font-semibold text-[var(--color-on-surface)] mb-3 mt-6 ml-2",

  card: "bg-[var(--color-surface-container)] rounded-xl p-4 mb-3 border border-[var(--color-outline-variant)]",
  cardInteractive:
    "bg-[var(--color-surface-container)] rounded-xl p-4 mb-3 border border-[var(--color-outline-variant)] cursor-pointer hover:bg-[var(--color-surface-container-high)] transition-colors",

  scoreGrid: "flex flex-row justify-between gap-3",
  scoreItem:
    "flex-1 flex flex-col items-center bg-[var(--color-secondary-container)] p-4 rounded-xl",
  scoreValue: "text-2xl font-bold text-[var(--color-on-secondary-container)]",
  scoreLabel:
    "text-sm text-[var(--color-on-secondary-container)] opacity-80 mt-1",
  scoreHint:
    "text-center text-xs mt-3 opacity-60 text-[var(--color-on-surface-variant)]",

  row: "flex justify-between items-center py-3 border-b border-[var(--color-outline-variant)]",
  rowLast: "flex justify-between items-center py-3",
  rowLabel: "text-sm text-[var(--color-on-surface-variant)] flex-1",
  rowValue:
    "text-sm font-semibold text-[var(--color-on-surface)] text-right flex-1",

  valuePositive: "text-sm font-semibold text-right flex-1 text-emerald-500",
  valueNegative:
    "text-sm font-semibold text-right flex-1 text-[var(--color-error)]",

  modalOverlay:
    "fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4",
  modalContent:
    "bg-[var(--color-background)] rounded-2xl p-6 w-full max-w-md shadow-xl",
  modalTitle: "text-xl font-semibold text-[var(--color-on-surface)] mb-4",
  modalButton:
    "w-full h-12 bg-[var(--color-primary)] text-[var(--color-on-primary)] rounded-xl font-semibold mt-4 hover:opacity-90 transition-opacity",
};
