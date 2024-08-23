import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { GetPayload } from "utils/authenticate";
import { ROLE_TYPE } from "utils/RoleType";
import { toast } from "react-toastify";

const PrivateRoute = ({ role = null, email = null }) => {
  const payload = GetPayload();

  if (payload.isLogin === false) {
    toast.warning("로그인이 필요한 서비스입니다.");
    return <Navigate replace to="/login" />;
  }

  if (role !== null && ROLE_TYPE[payload.role] > ROLE_TYPE[role]) {
    toast.error("해당 서비스를 이용하실 수 없습니다.");
    return <Navigate replace to="/" />;
  }

  if (email !== null && payload.email !== email) {
    toast.error("해당 서비스를 이용하실 수 없습니다.");
    return <Navigate replace to="/" />;
  }

  return <Outlet />;
};

export default PrivateRoute;
