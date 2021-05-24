import Store from "./store";

export const init = (store: Store) => {
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.code == "Digit1" && e.ctrlKey) {
      e.preventDefault();
      store.focusOnMain();
    }

    if ((e.code == "Digit2" || e.code == "KeyK") && e.ctrlKey) {
      e.preventDefault();
      store.toggleSearchVisibility();
    }
  };
  document.addEventListener("keydown", onKeyDown);
};
