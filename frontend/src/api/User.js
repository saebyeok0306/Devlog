import { OAUTH2_REDIRECT_URI, OAUTH2_URI } from "constants/api/oauth";
import { API } from "./Axios";

export const user_join_api = async(username, password, email) => {
  const requestBody = {
    "username": username,
    "password": password,
    "email": email
  }
  console.log("user_join_api post (", requestBody, ")");
  return await API.post("/join", requestBody)
  .then(response => response)
  .catch(error => {
    throw error;
  });
}

export const user_login_api = async(email, password) => {
  const requestBody = {
    "email": email,
    "password": password
  }
  console.log("user_login_api post (", requestBody, ")");
  return await API.post("/login", requestBody)
  .then(response => response)
  .catch(error => {
    throw error;
  });
}

export const user_oauth_login_api = async(provider) => {
  console.log("user_oauth_login_api post (", provider, ")");
  return await API.get(`${OAUTH2_URI}${provider}`) // ${OAUTH2_REDIRECT_URI}
  .then(response => response)
  .catch(error => {
    throw error;
  });
}

export const user_user_api = async(requestBody) => {
  console.log("user_user_api get");
  return await API.get("/user")
  .then(response => response)
  .catch(error => {
    throw error;
  });
}