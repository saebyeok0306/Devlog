import { atom } from "recoil";

export class CommentState {
  constructor(commentFlag = false) {
    this.commentFlag = commentFlag;
  }
}

export const EMPTY_COMMENT = new CommentState();

export const commentAtom = atom({
  key: "comment",
  /** @type {CommentState} */
  default: EMPTY_COMMENT,
});
