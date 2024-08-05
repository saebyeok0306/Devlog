import { atom } from "recoil";

export const postAtom = atom({
  key: "post",
  /** @type {string} */
  default: "",
});
