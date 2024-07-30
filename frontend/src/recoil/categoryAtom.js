import { atom } from "recoil";

export const categoryAtom = atom({
  key: "category",
  /** @type {number} */
  default: 0,
});
