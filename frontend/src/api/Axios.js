import axios from "axios";
import { useNavigate } from "react-router-dom";
import { authAtom } from "../recoil/authAtom";
import { useRecoilState } from "recoil";
import { useEffect } from "react";
import { getCookie } from "../utils/useCookie";
import { jwt_refresh_api } from "./User";
import {
  ACCESS_TOKEN_STRING,
  REFRESH_TOKEN_STRING,
} from "constants/user/login";
import { EMPTY_AUTH } from "constants/user/auth";

const REFRESH_URL = "/reissue";

export const API = axios.create({
  baseURL: `${process.env.REACT_APP_API_ENDPOINT}`,
  withCredentials: true,
});

export const AuthTokenInterceptor = ({ children }) => {
  const navigate = useNavigate();

  const [, setAuthDto] = useRecoilState(authAtom);

  useEffect(() => {
    requestAuthTokenInjector();
    requestRejectHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requestAuthTokenInjector = () => {
    API.interceptors.request.use((requestConfig) => {
      if (!requestConfig.headers) return requestConfig;

      if (requestConfig.url !== REFRESH_URL) {
        const token = getCookie(ACCESS_TOKEN_STRING);
        if (token) {
          requestConfig.headers["Authorization"] = "Bearer " + token;
        }
      } else {
        requestConfig.headers["Authorization"] =
          "Bearer " + getCookie(REFRESH_TOKEN_STRING);
      }
      return requestConfig;
    });
  };

  const requestRejectHandler = () => {
    API.interceptors.response.use(
      (res) => res,
      async (err) => {
        // Network Error
        if (!err.response?.status) return Promise.reject(err);

        const {
          config,
          response: { status },
        } = err;

        if (config.url === REFRESH_URL) {
          navigate("/");
          alert("다시 로그인을 해주세요.");
          setAuthDto(EMPTY_AUTH);
          // toast.info("다시 로그인을 해주세요.");
          return Promise.reject(err);
        }

        if (status === 401) {
          await jwt_refresh_api();
          return API(config);
        }

        return Promise.reject(err);
      }
    );
  };

  return children;
};
