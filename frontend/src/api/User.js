import { API } from "./Axios";
import { reissueToken } from "utils/authenticate";

export const user_join_api = async (username, password, email) => {
  const requestBody = {
    username: username,
    password: password,
    email: email,
  };
  console.log("post user_join_api (", requestBody, ")");
  return await API.post("/join", requestBody)
    .then((response) => response)
    .catch((error) => {
      throw error;
    });
};

export const user_login_api = async (email, password) => {
  const requestBody = {
    email: email,
    password: password,
  };
  console.log("post user_login_api (", requestBody, ")");
  return await API.post("/login", requestBody)
    .then((response) => response)
    .catch((error) => {
      throw error;
    });
};

export const user_check_api = async () => {
  console.log("get user_check_api");
  return await API.get("/check")
    .then((response) => response)
    .catch((error) => {
      throw error;
    });
};

export const jwt_refresh_api = async () => {
  console.log("get jwt_refresh_api");
  return await API.get("/reissue")
    .then((response) => {
      reissueToken(response.headers);
    })
    .catch((error) => {
      throw error;
    });
};
