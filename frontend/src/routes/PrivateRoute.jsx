import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { authAtom } from "../recoil/authAtom";
import { GetPayload } from "utils/authenticate";
import { ROLE_TYPE } from "utils/RoleType";

const PrivateRoute = ({ role = null, email = null }) => {
  const authDto = useRecoilValue(authAtom);
  // FIXME: Private 경로에서 로그아웃했을 때 오류 발생함.
  if (!authDto.isLogin) {
    alert("로그인이 필요한 서비스입니다.1");
    return <Navigate replace to="/login" />;
  }

  const payload = GetPayload();
  if (payload.isLogin === false) {
    alert("로그인이 필요한 서비스입니다.2");
    return <Navigate replace to="/login" />;
  }

  if (role !== null && ROLE_TYPE[payload.role] > ROLE_TYPE[role]) {
    alert("해당 서비스를 이용하실 수 없습니다.");
    return <Navigate replace to="/" />;
  }

  if (email !== null && payload.email !== email) {
    alert("해당 서비스를 이용하실 수 없습니다.");
    return <Navigate replace to="/" />;
  }

  return <Outlet />;
};

export default PrivateRoute;
