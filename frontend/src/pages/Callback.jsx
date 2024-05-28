import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { Auth, authAtom } from "recoil/authAtom";
import { setCookie } from "utils/useCookie";
import { decodeJWT } from "utils/useJWT";

function Callback() {
  const navigate = useNavigate();
  const location = useLocation();
  const [, setAuthDto] = useRecoilState(authAtom);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const access_token = searchParams.get("at");
    const refresh_token = searchParams.get("rt");
    if (access_token != null && refresh_token != null) {
      setCookie("access_token", access_token);
      setCookie("refresh_token", refresh_token);
    }
    const payload = decodeJWT(access_token);
    setAuthDto(new Auth(payload.name, payload.role, true));
    navigate("/");
  }, []);

  return <></>;
}

export default Callback;
