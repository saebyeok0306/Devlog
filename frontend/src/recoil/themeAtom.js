import { atom } from "recoil";

/* 0:light 1:dark 2:system */

const systemTheme = (theme) => {
  if (theme === 2) {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return 1;
    } else {
      return 0;
    }
  }
  return theme;
};

export const getTheme = () => {
  const theme = Number(localStorage.getItem("theme"));
  return systemTheme(theme);
};

export const setTheme = (flag) => {
  localStorage.setItem("theme", flag);
  return systemTheme(flag);
};

export const themeAtom = atom({
  key: "themeAtom",
  default: getTheme(), // isDarkMode
});
