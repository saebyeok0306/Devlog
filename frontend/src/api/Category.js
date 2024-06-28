import { API } from "./Axios";

export const get_categories_api = async () => {
  console.log("get_categories_api get");
  return await API.get("/categories")
    .then((response) => response)
    .catch((error) => {
      throw error;
    });
};

export const set_categories_api = async (categories) => {
  console.log("set_categories_api get");
  return await API.post("/categories", categories)
    .then((response) => response)
    .catch((error) => {
      throw error;
    });
};
