import { atom } from "recoil";

export class CommentState {
  constructor(commentFlag = false) {
    this.commentFlag = commentFlag;
  }
}

export class CommentsData {
  constructor(comments = [], commentCount = 0) {
    this.comments = comments;
    this.commentCount = commentCount;
  }
}

export const EMPTY_COMMENT = new CommentState();

export const commentAtom = atom({
  key: "comment",
  /** @type {CommentState} */
  default: EMPTY_COMMENT,
});

export const commentFilesAtom = atom({
  key: "commentFiles",
  default: [],
});

export const commentsAtom = atom({
  key: "comments",
  default: new CommentsData(),
});
