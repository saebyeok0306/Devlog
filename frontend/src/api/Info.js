import { API } from "./Axios";

export const get_info_api = async () => {
  console.log("get_info_api get");
  return await API.get("/info")
    .then((response) => response)
    .catch((error) => {
      throw error;
    });
};

export const set_info_api = async (about, profile_url) => {
  const requestBody = {
    about: about,
    profile_url: profile_url,
  };
  console.log("set_info_api post");
  return await API.post("/info", requestBody)
    .then((response) => response)
    .catch((error) => {
      throw error;
    });
};
