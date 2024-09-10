import { atom } from "recoil";

export class PostContext {
  constructor(
    id = null,
    title = "",
    content = "",
    category = null,
    files = [],
    preview = null,
    isPrivate = false
  ) {
    this.id = id;
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
