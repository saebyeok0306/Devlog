import { API } from "./Axios";

export const get_categories_api = async () => {
  console.log("get_categories_api get");
  return await API.get("/categories")
    .then((response) => response)
    .catch((error) => {
      throw error;
    });
};
