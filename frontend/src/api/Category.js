import mem from "mem";
import { API } from "./Axios";
import { CATEGORY_STORE } from "./Cache";

const get_categories = async () => {
  return await API.get("/categories")
    .then((response) => response)
    .catch((error) => {
      throw error;
    });
};

const get_cache_categories = mem(get_categories, {
  maxAge: 60 * 1000,
  cache: CATEGORY_STORE,
});

export const get_categories_api = async (cache = true) => {
  if (cache) {
    return await get_cache_categories();
  } else {
    return await get_categories();
  }
};

export const get_categories_detail_api = async () => {
  return await API.get("/categories/details")
    .then((response) => response)
    .catch((error) => {
      throw error;
    });
};

export const set_categories_api = async (categories) => {
  return await API.post("/categories", categories)
    .then((response) => response)
    .catch((error) => {
      throw error;
    });
};
