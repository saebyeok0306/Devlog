import mem from "mem";
import { API } from "./Axios";
import { POST_STORE } from "./Cache";

export const upload_post_api = async (
  id,
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
  if (id > 0) {
    requestBody["id"] = id;
  }
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
  {
    maxAge: 60 * 1000,
    cacheKey: (args) => JSON.stringify(args),
    cache: POST_STORE,
  }
);

export const get_post_url_api = async (postUrl) => {
  return await API.get(`/posts/${postUrl}`, {})
    .then((response) => response)
    .catch((error) => {
      throw error;
    });
};

export const get_post_files_api = async (postId) => {
  return await API.get(`/files/post/${postId}`)
    .then((response) => response)
    .catch((error) => {
      throw error;
    });
};
