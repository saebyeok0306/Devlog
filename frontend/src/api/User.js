import { API } from "./Axios";

export const user_join_api = async({username, password, email}) => {
  const requestBody = {
    "username": username,
    "password": password,
    "email": email
  }
  console.log("user_join_api post (", requestBody, ")");
  return await API.post("/user/join", requestBody)
  .then(response => response)
  .catch(error => {
    throw error;
  });
}

export const user_login_api = async(requestBody) => {
  console.log("user_login_api post (", requestBody, ")");
  return await API.post("/user/login", requestBody)
  .then(response => response)
  .catch(error => {
    throw error;
  });
}

export const user_user_api = async(requestBody) => {
  console.log("user_user_api get");
  return await API.get("/user/user")
  .then(response => response)
  .catch(error => {
    throw error;
  });
}