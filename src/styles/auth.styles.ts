export const authStyles = {
  wrapper: "flex min-h-screen bg-[var(--color-background)] font-sans",
  container:
    "flex w-full max-w-md mx-auto flex-col justify-center p-6 shrink-0",
  title:
    "mb-8 text-[var(--color-on-primary-container)] text-3xl font-semibold text-center",

  inputWrapper: "w-full relative mb-3",
  input:
    "w-full h-14 bg-[var(--color-surface-container)] rounded-xl px-4 text-base text-[var(--color-on-secondary-container)] placeholder-[var(--color-icon)] outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all",

  selectBox:
    "w-full h-14 bg-[var(--color-surface-container)] rounded-xl px-4 flex justify-between items-center cursor-pointer outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all",

  dropdown:
    "absolute top-[60px] left-0 right-0 bg-[var(--color-surface-container)] rounded-xl border border-[var(--color-outline-variant)] overflow-hidden shadow-lg z-50 max-h-60 overflow-y-auto",
  dropdownItem:
    "p-4 border-b border-[var(--color-outline-variant)] last:border-b-0 hover:bg-[var(--color-surface-container-highest)] transition-colors cursor-pointer text-[var(--color-on-surface)]",

  checkboxContainer:
    "flex flex-row items-center self-start my-4 px-1 cursor-pointer select-none group",
  checkbox:
    "w-5 h-5 rounded border-2 border-[var(--color-primary)] flex justify-center items-center mr-3 transition-colors",
  checkboxChecked: "bg-[var(--color-primary)]",
  checkboxText:
    "text-sm text-[var(--color-outline)] group-hover:text-[var(--color-on-surface)] transition-colors",

  mainButton:
    "w-full h-14 bg-[var(--color-primary)] text-[var(--color-on-primary)] rounded-xl flex justify-center items-center mt-4 shadow-sm hover:opacity-90 transition-opacity text-base font-semibold",

  rowButtons: "flex flex-row justify-between w-full mt-6 gap-3",
  secondaryButton:
    "flex-1 h-12 bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)] rounded-xl flex justify-center items-center hover:opacity-90 transition-opacity text-sm font-medium",
};
