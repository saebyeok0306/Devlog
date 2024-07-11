import axios from "axios";
import { authAtom } from "../recoil/authAtom";
import { useRecoilState } from "recoil";
import { getCookie } from "../utils/hooks/useCookie";
import { jwt_refresh_api } from "./User";
import {
  ACCESS_TOKEN_STRING,
  REFRESH_TOKEN_STRING,
} from "constants/user/login";
import { EMPTY_AUTH } from "constants/user/auth";
import { toast } from "react-toastify";

const REFRESH_URL = "/reissue";

export const API = axios.create({
  baseURL: `${process.env.REACT_APP_API_ENDPOINT}`,
  withCredentials: true,
});

export const AuthTokenInterceptor = ({ children }) => {
  const [, setAuthDto] = useRecoilState(authAtom);

  const requestAuthTokenInjector = () => {
    if (API.interceptors.request.handlers.length > 0) return;
    API.interceptors.request.use((requestConfig) => {
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
    });
  };

  const requestRejectHandler = () => {
    if (API.interceptors.response.handlers.length > 0) return;
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
          toast.error(`다시 로그인을 해주세요.`, {});
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

  requestAuthTokenInjector();
  requestRejectHandler();

  return children;
};
