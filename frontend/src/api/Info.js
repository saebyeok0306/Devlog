import { API } from "./Axios";

export const get_info_api = async () => {
  console.log("get_info_api get");
  return await API.get("/info")
    .then((response) => response)
    .catch((error) => {
      throw error;
    });
};
