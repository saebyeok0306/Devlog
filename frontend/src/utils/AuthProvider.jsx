import { jwt_refresh_api, user_check_api } from "api/User";
import { useRecoilState } from "recoil";
import { authAtom } from "recoil/authAtom";
import { signIn, signOut } from "./authenticate";

import murmurhash from "murmurhash";
import { useInterval } from "./useInterval";
import { getCookie } from "./useCookie";
import {
  ACCESS_TOKEN_STRING,
  REFRESH_TOKEN_STRING,
} from "constants/user/login";
import { useEffect, useState } from "react";

function AuthProvider({ children }) {
  const [refresh, setRefresh] = useState(0);
  const [authDto, setAuthDto] = useRecoilState(authAtom);

  const authenticateUser = () => {
    if (!authDto?.isLogin) return;

    const verify_access_token = () => {
      const curhash = murmurhash.v3(getCookie(ACCESS_TOKEN_STRING) || 0);
      const datahash = Number(sessionStorage.getItem("at"));
      if (datahash !== curhash) {
        sessionStorage.setItem("at", curhash);
        return true;
      }
      return false;
    };

    const verify_refresh_token = () => {
      const curhash = murmurhash.v3(getCookie(REFRESH_TOKEN_STRING) || 0);
      const datahash = Number(sessionStorage.getItem("rt"));
      if (datahash !== curhash) {
        sessionStorage.setItem("rt", curhash);
        return true;
      }
      return false;
    };

    if (verify_access_token() || verify_refresh_token()) {
      console.log("사용자를 검증합니다.");
      user_check_api()
        .then()
        .catch((err) => {
          signOut(
            setAuthDto,
            err?.response ? err.response.data.error : err.message
          );
        });
    }
  };

  // 10초 단위
  const intervalTime = 10 * 1000;
  useInterval(() => {
    authenticateUser();
  }, intervalTime);

  useEffect(() => {
    const access_token = getCookie(ACCESS_TOKEN_STRING);
    const refresh_token = getCookie(REFRESH_TOKEN_STRING);
    if (authDto.isLogin) return;
    if (refresh_token == null) return;
    if (access_token == null) {
      jwt_refresh_api()
        .then((res) => {
          setRefresh(refresh + 1);
        })
        .catch((err) => {
          console.log("err: ", err);
          signOut(setAuthDto, "다시 로그인 해주세요.");
        });
    }
    if (access_token == null || refresh_token == null) return;
    signIn(access_token, refresh_token, setAuthDto, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authDto, refresh]);

  return <>{children}</>;
}

export default AuthProvider;
