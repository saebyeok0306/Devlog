import { atom } from "recoil";

export class PostContext {
  constructor(
    title = "",
    content = "",
    category = null,
    files = [],
    preview = null,
    isPrivate = false
  ) {
    this.title = title;
    this.content = content;
    this.category = category;
    this.files = files;
    this.preview = preview;
    this.isPrivate = isPrivate;
  }
}

export const postContextAtom = atom({
  key: "postContext",
  /** @type {PostContext} */
  default: new PostContext(),
});
