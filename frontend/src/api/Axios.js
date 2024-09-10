import axios from "axios";
import { authAtom } from "../recoil/authAtom";
import { useRecoilState } from "recoil";
import { jwt_refresh_api } from "./User";
import { useNavigate } from "react-router-dom";
import { warnSignOut } from "utils/authenticate";
import { useEffect } from "react";
import mem from "mem";
import { ETC_STORE } from "./Cache";

const REFRESH_URL = "/reissue";

export const API = axios.create({
  baseURL: `${process.env.REACT_APP_API_ENDPOINT}`,
  withCredentials: true,
});

const requestAuthTokenInjector = async (request) => {
  return request;
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

  const signOutToast = mem(
    async (message, path) => {
      warnSignOut(setAuthDto, message);
      navigate(path);
    },
    { maxAge: 5, cache: ETC_STORE }
  );

  if (config.url === REFRESH_URL) {
    await signOutToast("다시 로그인을 해주세요.", "/login", navigate);
    return Promise.reject(err);
  }

  if (status === 401) {
    if (data.error.startsWith("유효하지 않은 토큰입니다")) {
      await signOutToast(data.error, "/");
      return Promise.reject(err);
    }
    try {
      await jwt_refresh_api(authDto.email);
    } catch (error) {
      return Promise.reject(err);
    }
    return API(config);
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
