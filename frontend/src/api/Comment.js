import { API } from "./Axios";

export const edit_comment_api = async (
  commentId,
  content,
  files,
  isPrivate
) => {
  const requestBody = {
    content: content,
    files: files,
    isPrivate: isPrivate,
  };

  return await API.post(`/comments/${commentId}`, requestBody)
    .then((response) => response)
    .catch((error) => {
      throw error;
    });
};

export const upload_comment_api = async (
  post,
  parent,
  content,
  files,
  isPrivate
) => {
  const requestBody = {
    postUrl: post.url,
    parent: parent,
    content: content,
    files: files,
    isPrivate: isPrivate,
  };

  return await API.post(`/comments`, requestBody)
    .then((response) => response)
    .catch((error) => {
      throw error;
    });
};

export const delete_comment_api = async (commentId) => {
  return await API.delete(`/comments/${commentId}`)
    .then((response) => response)
    .catch((error) => {
      throw error;
    });
};

export const get_comments_by_post_api = async (postId) => {
  return await API.get(`/comments/post/${postId}`)
    .then((response) => response)
    .catch((error) => {
      throw error;
    });
};

export const get_comment_files_api = async (commentId) => {
  return await API.get(`/files/comment/${commentId}`)
    .then((response) => response)
    .catch((error) => {
      throw error;
    });
};
