import React, { useEffect, useState } from "react";

import "./Profile.scss";
import { GetPayload } from "utils/authenticate";
import { get_info_api } from "api/Info";
import EditIcon from "assets/icons/Edit";
import { useRecoilState } from "recoil";
import { themeAtom } from "recoil/themeAtom";
import { Link } from "react-router-dom";
import { Tooltip } from "flowbite-react";
// import profile_img from '../../assets/profile.jpg';

function Profile() {
  const payload = GetPayload();
  const [isDark] = useRecoilState(themeAtom);
  const [profile, setProfile] = useState();

  useEffect(() => {
    get_info_api()
      .then((res) => {
        setProfile(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const ProfileEditIcon = () => {
    return (
      <div className="icon">
        <EditIcon
          width="100%"
          height="100%"
          stroke={isDark ? "#fff" : "#000"}
        />
      </div>
    );
  };

  return (
    <div className="profile">
      <div className="profile-image">
        <img src={"/assets/ryan-riggins-216051.jpg"} alt="profile" />
      </div>
      <div className="profile-username">
        <p>{profile?.username}</p>
        {payload.role === "ADMIN" ? (
          <Link to="/manager/info">
            <Tooltip content="Edit" style={isDark ? "dark" : "light"}>
              <ProfileEditIcon />
            </Tooltip>
          </Link>
        ) : null}
      </div>
      <p>{profile?.about}</p>
    </div>
  );
}

export default Profile;
