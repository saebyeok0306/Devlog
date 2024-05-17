import { atom } from "recoil";

export const getTheme = () => {
  const theme = Number(localStorage.getItem('theme'));
  return theme;
}

export const themeAtom = atom({
  key: "themeAtom",
  default: getTheme(), // isDarkMode
});