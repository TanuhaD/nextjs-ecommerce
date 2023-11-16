export const closeDropdowns = () => {
  const elem = document.activeElement as HTMLElement;
  if (elem) {
    elem.blur();
  }
};
