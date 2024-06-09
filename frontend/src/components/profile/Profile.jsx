import React, { useState } from "react";

import "./Profile.scss";
import { useRecoilValue } from "recoil";
import { authAtom } from "recoil/authAtom";
import { getPayload } from "utils/authenticate";
// import profile_img from '../../assets/profile.jpg';

const profile_info = {
  username: "갈대",
  email: "westreed@naver.com",
  comment: "코멘트 부분",
  profile_url: "/assets/ryan-riggins-216051.jpg",
};

function Profile() {
  const authDto = useRecoilValue(authAtom);
  const payload = getPayload();
  return (
    <div className="profile">
      <div className="profile-image">
        <img src={profile_info.profile_url} alt="profile" />
      </div>
      <div>{profile_info.username}</div>
      <div>{profile_info.comment}</div>
      {payload.role === "ADMIN" ? <div>관리</div> : null}
    </div>
  );
}

export default Profile;
