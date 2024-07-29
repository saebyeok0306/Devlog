import { atom } from "recoil";

export const categoryAtom = atom({
  key: "category",
  /** @type {string} */
  default: "ALL",
});
