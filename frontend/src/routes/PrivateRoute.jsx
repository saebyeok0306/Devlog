import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useRecoilState } from "recoil";
import { authAtom } from "../recoil/authAtom";
import { getPayload } from "utils/authenticate";

const PrivateRoute = (role = null, email = null) => {
  const [authDto] = useRecoilState(authAtom);

  if (!authDto.isLogin) {
    alert("로그인이 필요한 서비스입니다.");
    return <Navigate to="/login" />;
  }

  const payload = getPayload();

  if (role !== null && payload.role.toLowerCase() !== role.toLowerCase()) {
    alert("해당 서비스를 이용하실 수 없습니다.");
    return <Navigate to="/" />;
  }

  if (email !== null && payload.email !== email) {
    alert("해당 서비스를 이용하실 수 없습니다.");
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default PrivateRoute;
