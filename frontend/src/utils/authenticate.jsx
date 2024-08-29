import { Auth, authAtom } from "recoil/authAtom";
import { getCookie, removeCookie, setCookie } from "./hooks/useCookie";
import { decodeJWT } from "./hooks/useJWT";
import {
  ACCESS_TOKEN_STRING,
  REFRESH_TOKEN_STRING,
} from "constants/user/login";
import { useRecoilState } from "recoil";
import { toast } from "react-toastify";
import { clearAllCacheStore } from "api/Cache";
import { useEffect } from "react";

export const signIn = async (
  accessToken,
  refreshToken,
  setAuthDto,
  message = "로그인 성공!"
) => {
  if (accessToken != null && refreshToken != null) {
    const payload = decodeJWT(accessToken);

    setCookie(ACCESS_TOKEN_STRING, accessToken, { path: "/" });
    setCookie(REFRESH_TOKEN_STRING, refreshToken, { path: "/" });

    setAuthDto(new Auth(payload.username, payload.email, true, payload.role));

    clearAllCacheStore(); // 캐시 초기화
    if (message !== false) toast.success(`${message}`, {});
    return true;
  }
  return false;
};

export const signOut = (setAuthDto, message = "로그아웃 했습니다.") => {
  setAuthDto(new Auth());
  removeCookie(ACCESS_TOKEN_STRING);
  removeCookie(REFRESH_TOKEN_STRING);
  clearAllCacheStore(); // 캐시 초기화
  toast.success(`${message}`, {});
};

export const warnSignOut = (
  setAuthDto,
  message = "로그인이 만료되었습니다."
) => {
  setAuthDto(new Auth());
  removeCookie(ACCESS_TOKEN_STRING);
  removeCookie(REFRESH_TOKEN_STRING);
  clearAllCacheStore(); // 캐시 초기화
  toast.warning(`${message}`, {});
};

export const reissueToken = (headers) => {
  const accessToken = headers["authorization"];
  const refreshToken = getCookie(REFRESH_TOKEN_STRING);

  if (accessToken == null || refreshToken == null)
    throw new Error("토큰이 없습니다.");

  setCookie(ACCESS_TOKEN_STRING, accessToken, { path: "/" });

  return accessToken;
};

export const GetPayload = () => {
  const [authDto, setAuthDto] = useRecoilState(authAtom);

  useEffect(() => {
    const token = getCookie(ACCESS_TOKEN_STRING);
    if (token == null) {
      setAuthDto(new Auth());
      return;
    }
    if (authDto?.isLogin) return;
    const payload = decodeJWT(token);
    setAuthDto(new Auth(payload.username, payload.email, true, payload.role));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return authDto;
};
