import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { authAtom } from "../recoil/authAtom";

const PublicRoute = () => {
  const authDto = useRecoilValue(authAtom);

  return !authDto?.isLogin ? <Outlet /> : <Navigate to="/" />;
};

export default PublicRoute;
