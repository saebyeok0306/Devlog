import axios from "axios";
import { authAtom } from "../recoil/authAtom";
import { useRecoilState } from "recoil";
import { getCookie } from "../utils/hooks/useCookie";
import { jwt_refresh_api } from "./User";
import {
  ACCESS_TOKEN_STRING,
  REFRESH_TOKEN_STRING,
} from "constants/user/login";
import { useNavigate } from "react-router-dom";
import { warnSignOut } from "utils/authenticate";
import { showAllCacheStore } from "./Cache";
import { useEffect } from "react";
import throttle from "lodash.throttle";

const REFRESH_URL = "/reissue";

export const API = axios.create({
  baseURL: `${process.env.REACT_APP_API_ENDPOINT}`,
  withCredentials: true,
});

const requestAuthTokenInjector = async (requestConfig) => {
  // if (!requestConfig.headers) return requestConfig;
  if (requestConfig.url !== REFRESH_URL) {
    var token = getCookie(ACCESS_TOKEN_STRING);
    if (token) {
      requestConfig.headers["Authorization"] = "Bearer " + token;
    }
  } else {
    token = getCookie(REFRESH_TOKEN_STRING);
    requestConfig.headers["Authorization"] = "Bearer " + token;
  }
  return requestConfig;
};

const responseSuccessHandler = (response) => {
  console.log(response);
  return response;
};

const responseRejectHandler = async (err, navigate, authDto, setAuthDto) => {
  // Network Error
  if (!err.response?.status) return Promise.reject(err);

  const {
    config,
    response: { status, data },
  } = err;

  const signOutToast = throttle(async (message, path) => {
    warnSignOut(setAuthDto, message);
    navigate(path);
  }, 1000);

  if (config.url === REFRESH_URL) {
    await signOutToast("다시 로그인을 해주세요.", "/login");
    return Promise.reject(err);
  }

  if (status === 401) {
    if (data.error.startsWith("유효하지 않은 토큰입니다")) {
      await signOutToast(data.error, "/");
      return Promise.reject(err);
    }
    if (authDto?.isLogin) {
      await jwt_refresh_api(authDto.email);
      return API(config);
    }
  }

  return Promise.reject(err);
};

export const AuthTokenInterceptor = () => {
  const navigate = useNavigate();
  const [authDto, setAuthDto] = useRecoilState(authAtom);

  const requestHandler = API.interceptors.request.use(requestAuthTokenInjector);
  const rejectHandler = API.interceptors.response.use(
    (response) => responseSuccessHandler(response),
    (error) => responseRejectHandler(error, navigate, authDto, setAuthDto)
  );

  useEffect(() => {
    return () => {
      API.interceptors.request.eject(requestHandler);
      API.interceptors.response.eject(rejectHandler);
    };
  }, [requestHandler, rejectHandler]);
};

export const AxiosProvider = ({ children }) => {
  AuthTokenInterceptor();

  return <>{children}</>;
};
