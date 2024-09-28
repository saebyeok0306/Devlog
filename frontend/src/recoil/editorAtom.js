import { atom } from "recoil";

export class PostContext {
  constructor(
    id = null,
    title = "",
    content = "",
    category = null,
    files = [],
    preview = null,
    isPrivate = false,
    createdAt = null,
    modifiedAt = null,
    url = "",
    views = 0
  ) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.category = category;
    this.files = files;
    this.preview = preview;
    this.isPrivate = isPrivate;
    this.createdAt = createdAt;
    this.modifiedAt = modifiedAt;
    this.url = url;
    this.views = views;
  }
}

export const postContextAtom = atom({
  key: "postContext",
  /** @type {PostContext} */
  default: new PostContext(),
});
