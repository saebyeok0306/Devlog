import mem from "mem";
import { API } from "./Axios";
import { CATEGORY_STORE } from "./Cache";

const get_categories = async () => {
  console.log("get_categories_api get");
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

// { maxAge: 60 * 1000, cache: CATEGORY_STORE }

export const set_categories_api = async (categories) => {
  console.log("set_categories_api get");
  return await API.post("/categories", categories)
    .then((response) => response)
    .catch((error) => {
      throw error;
    });
};
