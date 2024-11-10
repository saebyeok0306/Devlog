import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { authAtom } from "@/recoil/authAtom";
import { signIn } from "@/utils/authenticate";

function Callback() {
  const navigate = useNavigate();
  // const location = useLocation();
  const [, setAuthDto] = useRecoilState(authAtom);

  useEffect(() => {
    // const searchParams = new URLSearchParams(location.search);
    // const access_token = searchParams.get("at");
    // const refresh_token = searchParams.get("rt");
    // signIn(access_token, refresh_token, setAuthDto);
    const res = signIn(setAuthDto);
    console.log("callback", res);
    navigate("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
}

export default Callback;
