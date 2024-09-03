import { API } from "./Axios";

export const edit_comment_api = async (
  comment_id,
  content,
  files,
  isPrivate
) => {
  const requestBody = {
    content: content,
    files: files,
    isPrivate: isPrivate,
  };

  return await API.post(`/comments/${comment_id}`, requestBody)
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

export const delete_comment_api = async (comment_id) => {
  return await API.delete(`/comments/${comment_id}`)
    .then((response) => response)
    .catch((error) => {
      throw error;
    });
};
