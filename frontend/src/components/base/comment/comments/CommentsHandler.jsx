import {
  delete_comment_api,
  edit_comment_api,
  upload_comment_api,
} from "api/Comment";
import { toast } from "react-toastify";

const isWriteComment = ({ commentState, authDto }) => {
  if (commentState.commentFlag === true && authDto?.isLogin === true) {
    return true;
  }
  return false;
};

const addClientComment = ({ targetId, comment, comments }) => {
  let isEdit = false;
  for (let i = 0; i < comments.length; i++) {
    if (isEdit) break;
    const parent = comments[i];
    if (parent.id === targetId) {
      if (!parent.children) parent.children = [];
      comment["parentData"] = parent;
      comment["root"] = parent.id;
      parent.children.push(comment);
      break;
    }
    if (!parent.children) continue;
    for (let j = 0; j < parent.children.length; j++) {
      const child = parent.children[j];
      if (child.id === targetId) {
        comment["parentData"] = child;
        comment["root"] = parent.id;
        parent.children.push(comment);
        isEdit = true;
        break;
      }
    }
  }
};

const updateClientComment = ({ targetId, comments, reply }) => {
  let isEdit = false;
  for (let i = 0; i < comments.length; i++) {
    if (isEdit) break;
    const parent = comments[i];
    if (parent.id === targetId) {
      parent.content = reply.content;
      parent.private = reply.private;
      parent.deleted = reply.deleted;
      break;
    }
    if (!parent.children) continue;
    for (let j = 0; j < parent.children.length; j++) {
      const child = parent.children[j];
      if (child.id === targetId) {
        child.content = reply.content;
        child.private = reply.private;
        child.deleted = reply.deleted;
        isEdit = true;
        break;
      }
    }
  }
};

const uploadReplyHandler = async ({
  postContent,
  comments,
  reply,
  setReply,
}) => {
  try {
    const result = await upload_comment_api(
      postContent,
      reply.target.id,
      reply.content,
      reply.files,
      reply.private
    );
    const comment = result.data;
    addClientComment({
      targetId: reply.target.id,
      comment: comment,
      comments: comments,
    });
    cancelEditHandler({ reply: reply, setReply: setReply });

    toast.info("댓글이 등록되었습니다.");
    return true;
  } catch (err) {
    return false;
  }
};

const uploadCommentHandler = async ({
  postContent,
  comments,
  editorComment,
  setEditorComment,
}) => {
  try {
    const result = await upload_comment_api(
      postContent,
      0,
      editorComment.content,
      editorComment.files,
      editorComment.private
    );
    const comment = result.data;
    comments.push(comment);
    setEditorComment({
      ...editorComment,
      content: "",
      files: [],
      private: false,
    });

    toast.info("댓글이 등록되었습니다.");
    return true;
  } catch (err) {
    return false;
  }
};

const onReplyHandler = async ({ targetComment, reply, setReply }) => {
  let root = targetComment?.root;
  if (!root) root = targetComment.id;
  if (reply.editId !== root) {
    await setReply({
      ...reply,
      flag: true,
      editId: root,
      target: targetComment,
      content: "",
      files: [],
    });
  } else {
    await setReply({ ...reply, flag: true, target: targetComment });
  }
};

const onEditHandler = async ({ comment, reply, setReply }) => {
  await setReply({
    ...reply,
    flag: false,
    editId: comment.id,
    content: comment.content,
    files: [],
  });
};

const cancelEditHandler = async ({ reply, setReply }) => {
  await setReply({
    ...reply,
    flag: false,
    editId: null,
    target: null,
    files: [],
  });
  // setReplyComment("");
};

const updateEditHandler = async ({ comment, comments, reply, setReply }) => {
  try {
    await edit_comment_api(
      comment.id,
      reply.content,
      reply.files,
      reply.private
    );
    updateClientComment({
      targetId: comment.id,
      comments: comments,
      reply: reply,
    });
    await cancelEditHandler({ setReply: setReply });
    return true;
  } catch (err) {
    return false;
  }
};

const deleteCommentHandler = async ({ comment, comments, setUpdater }) => {
  try {
    await delete_comment_api(comment.id);
    const deleteComment = {
      content: comment.content,
      private: false,
      deleted: true,
    };
    updateClientComment({
      targetId: comment.id,
      comments: comments,
      reply: deleteComment,
    });
    await setUpdater((prev) => prev + 1);
    return true;
  } catch (err) {
    return false;
  }
};

export {
  isWriteComment,
  addClientComment,
  uploadReplyHandler,
  uploadCommentHandler,
  onReplyHandler,
  onEditHandler,
  cancelEditHandler,
  updateClientComment,
  updateEditHandler,
  deleteCommentHandler,
};
