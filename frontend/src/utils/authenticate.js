import { Auth } from "recoil/authAtom";
import { getCookie, removeCookie, setCookie } from "./useCookie";
import { decodeJWT } from "./useJWT";
import {
  ACCESS_TOKEN_STRING,
  REFRESH_TOKEN_STRING,
} from "constants/user/login";

export const signIn = (
  accessToken,
  refreshToken,
  setAuthDto,
  message = "로그인 성공!"
) => {
  if (accessToken != null && refreshToken != null) {
    const payload = decodeJWT(accessToken);
    const payload_refresh = decodeJWT(refreshToken);
    setCookie(ACCESS_TOKEN_STRING, accessToken, {
      path: "/",
      expires: new Date(payload_refresh.exp * 1000),
    });
    setCookie(REFRESH_TOKEN_STRING, refreshToken, {
      path: "/",
      expires: new Date(payload_refresh.exp * 1000),
    });
    setAuthDto(new Auth(payload.name, payload.role, true));
    alert(message);

    return true;
  }
  return false;
};

export const signOut = (setAuthDto, message = "로그아웃 했습니다.") => {
  alert(message);
  setAuthDto(new Auth());
  removeCookie(ACCESS_TOKEN_STRING);
  removeCookie(REFRESH_TOKEN_STRING);
};

export const reissueToken = (headers) => {
  const accessToken = headers["authorization"];
  const refreshToken = getCookie(REFRESH_TOKEN_STRING);
  if (accessToken == null || refreshToken == null)
    throw new Error("토큰이 없습니다.");
  const payload_refresh = decodeJWT(getCookie(REFRESH_TOKEN_STRING));
  setCookie(ACCESS_TOKEN_STRING, accessToken, {
    path: "/",
    expires: new Date(payload_refresh.exp * 1000),
  });
};
