import { API } from "./Axios";

export const upload_post_api = async (
  postUrl,
  title,
  content,
  previewUrl,
  email,
  categoryId,
  files,
  isPrivate
) => {
  console.log("upload_post_api post");
  const requestBody = {
    url: postUrl,
    title: title,
    content: content,
    previewUrl: previewUrl,
    email: email,
    categoryId: categoryId,
    files: files,
    isPrivate: isPrivate,
  };
  return await API.post("/posts", requestBody, {})
    .then((response) => response)
    .catch((error) => {
      throw error;
    });
};
