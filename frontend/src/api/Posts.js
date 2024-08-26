import mem from "mem";
import { API } from "./Axios";

export const upload_post_api = async (
  postUrl,
  title,
  content,
  previewUrl,
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

export const get_posts_api = mem(
  async (categoryId = null, page = 0, size = 10) => {
    if (categoryId === null || categoryId === 0) {
      return await API.get(`/posts?page=${page}&size=${size}`, {})
        .then((response) => response)
        .catch((error) => {
          throw error;
        });
    } else {
      return await API.get(
        `/posts/category/v2/${categoryId}?page=${page}&size=${size}`,
        {}
      )
        .then((response) => response)
        .catch((error) => {
          throw error;
        });
    }
  },
  { maxAge: 10000, cacheKey: (args) => JSON.stringify(args) }
);

export const get_post_url_api = async (postUrl) => {
  return await API.get(`/posts/${postUrl}`, {})
    .then((response) => response)
    .catch((error) => {
      throw error;
    });
};
