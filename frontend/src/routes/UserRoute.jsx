import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { authAtom } from "../recoil/authAtom";

// 로그인한 유저만 들어올 수 있음.
const UserRoute = () => {
  const authDto = useRecoilValue(authAtom);

  return authDto?.isLogin ? <Outlet /> : <Navigate to="/" />;
};

export default UserRoute;
