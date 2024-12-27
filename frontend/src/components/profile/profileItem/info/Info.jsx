"use client";

import "./Info.scss";
import { Button } from "flowbite-react";
import React from "react";
import { useRecoilState } from "recoil";
import { authAtom } from "@/recoil/authAtom";

function Info() {
  const [authDto, setAuthDto] = useRecoilState(authAtom);
  return (
    <div className="profile-info-flex">
      <div className="info-area">
        <div className="username">{authDto.username}</div>
        <div className="desc">{authDto.about}</div>
      </div>
      <div>
        <Button size="xs">수정하기</Button>
      </div>
    </div>
  );
}

export default Info;
