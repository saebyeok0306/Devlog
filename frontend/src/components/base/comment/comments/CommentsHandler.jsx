import {
  delete_comment_api,
  edit_comment_api,
  get_comment_files_api,
  upload_comment_api,
} from "api/Comment";
import { toast } from "react-toastify";

const isWriteComment = ({ commentState, authDto }) => {
  if (commentState.commentFlag === true && authDto?.isLogin === true) {
    return true;
  }
  return false;
};

const uploadReplyHandler = async ({
  postContent,
  comments,
  reply,
  setReply,
  content,
  files,
}) => {
  try {
    await upload_comment_api(
      postContent,
      reply.target.id,
      content, // reply.content,
      files,
      reply.private
    );
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
  content,
  files,
}) => {
  try {
    await upload_comment_api(
      postContent,
      0,
      content, // editorComment.content,
      files, // editorComment.files,
      editorComment.private
    );
    // const comment = result.data;
    // comments.push(comment);
    setEditorComment({
      ...editorComment,
      content: "",
      private: false,
    });

    toast.info("댓글이 등록되었습니다.");
    return true;
  } catch (err) {
    return false;
  }
};

const onReplyHandler = async ({
  targetComment,
  reply,
  setReply,
  setCommentFiles,
}) => {
  let root = targetComment?.root;
  if (!root) root = targetComment.id;
  if (reply.editId !== root) {
    await setReply({
      ...reply,
      flag: true,
      editId: root,
      target: targetComment,
      content: "",
    });
  } else {
    await setReply({ ...reply, flag: true, target: targetComment });
  }
  await setCommentFiles([]);
};

const onEditHandler = async ({ comment, reply, setReply, setCommentFiles }) => {
  await setReply({
    ...reply,
    flag: false,
    editId: comment.id,
    content: comment.content,
  });
  try {
    const res = await get_comment_files_api(comment.id);
    await setCommentFiles(res.data);
  } catch (err) {
    await setCommentFiles([]);
    toast.error("댓글 파일을 불러오는데 실패했습니다.");
    console.error("Failed to get comment files:", err);
  }
};

const cancelEditHandler = async ({ reply, setReply }) => {
  await setReply({
    ...reply,
    flag: false,
    editId: null,
    target: null,
  });
  // setReplyComment("");
};

const updateEditHandler = async ({
  comment,
  comments,
  reply,
  setReply,
  content,
  files,
}) => {
  try {
    await edit_comment_api(comment.id, content, files, reply.private); // reply.content
    await cancelEditHandler({ reply: reply, setReply: setReply });
    return true;
  } catch (err) {
    return false;
  }
};

const deleteCommentHandler = async ({ comment, setUpdater }) => {
  try {
    await delete_comment_api(comment.id);
    await setUpdater((prev) => prev + 1);
    return true;
  } catch (err) {
    return false;
  }
};

export {
  isWriteComment,
  uploadReplyHandler,
  uploadCommentHandler,
  onReplyHandler,
  onEditHandler,
  cancelEditHandler,
  updateEditHandler,
  deleteCommentHandler,
};
