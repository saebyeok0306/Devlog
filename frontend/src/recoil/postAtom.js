import { atom } from "recoil";

export const POST_DEFAULT = {
  id: null,
  url: "",
  title: "",
  content: "",
  previewUrl: "",
  user: null,
  category: null,
  views: 0,
  isPrivate: false,
  modifiedAt: null,
  createdAt: null,
  ownership: false,
};

export const postAtom = atom({
  key: "post",
  default: { ...POST_DEFAULT },
});
