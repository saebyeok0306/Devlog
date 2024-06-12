import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useRecoilState } from "recoil";
import { authAtom } from "../recoil/authAtom";
import { GetPayload } from "utils/authenticate";

const checkRole = (roles, targetRole) => {
  if (!Array.isArray(roles))
    throw Error("PrivateRoute에서 roles는 배열이어야 합니다.");
  for (var i = 0; i < roles.length; i++) {
    if (targetRole === roles[i]) {
      return false;
    }
  }
  return true;
};

const PrivateRoute = ({ roles = [], email = null }) => {
  const [authDto] = useRecoilState(authAtom);
  if (!authDto.isLogin) {
    alert("로그인이 필요한 서비스입니다.");
    return <Navigate to="/login" />;
  }

  const payload = GetPayload();

  if (roles !== null && checkRole(roles, payload.role)) {
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
