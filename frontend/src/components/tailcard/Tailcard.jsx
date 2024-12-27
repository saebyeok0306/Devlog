"use client";
import "./Tailcard.scss";
import { useRecoilValue } from "recoil";
import { authAtom } from "@/recoil/authAtom";
import { SHORT_BLOG_NAME } from "@/constants/base/main";
import { Avatar } from "flowbite-react";
import { renderAtom } from "@/recoil/renderAtom";

function Tailcard() {
  const authDto = useRecoilValue(authAtom);
  const isRender = useRecoilValue(renderAtom);

  if (!isRender) {
    return <></>;
  }

  return (
    <div className="tailcard-container">
      <div className="profile">
        <Avatar className="avatar" img={authDto.profileUrl} size="lg" rounded />
      </div>
      <div className="info">
        <p className="name">
          {authDto.username}｜{SHORT_BLOG_NAME}
        </p>
        <p className="desc">{authDto?.about || ""}</p>
        {/* TODO: github link icon */}
        <ul>
          <li></li>
        </ul>
      </div>
    </div>
  );
}

export default Tailcard;
