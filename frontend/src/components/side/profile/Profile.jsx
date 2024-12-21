"use client";
import React, { useEffect, useRef, useState } from "react";

import "./Profile.scss";
import { get_info_api, set_info_api } from "@/api/info";
import EditIcon from "@/assets/icons/Edit";
import { useRecoilValue } from "recoil";
import { Tooltip } from "flowbite-react";
import { onErrorImg } from "@/utils/defaultImg";
import { authAtom } from "@/recoil/authAtom";
import { useTheme } from "next-themes";
// import profile_img from '../../assets/profile.jpg';

function Profile() {
  const authDto = useRecoilValue(authAtom);
  const textarea = useRef();
  const { resolvedTheme } = useTheme();
  const [profile, setProfile] = useState();
  const [editMode, setEditMode] = useState(false);
  const [editProfile, setEditProfile] = useState();

  useEffect(() => {
    get_info_api()
      .then((res) => {
        setProfile(res);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleResizeHeight = (e = null, setter = null) => {
    textarea.current.style.height = "auto"; //height 초기화
    textarea.current.style.height = textarea.current.scrollHeight + 2 + "px";
    if (setter !== null) setter({ ...profile, about: e.target.value });
  };

  const handleEdit = (e) => {
    e.preventDefault();
    setEditMode(!editMode);
    if (editMode === false) {
      setEditProfile(profile);
    } else {
      if (
        editProfile.username === profile.username &&
        editProfile.about === profile.about &&
        editProfile.profile_url === profile.profile_url
      )
        return;
      set_info_api(editProfile.about, editProfile.profile_url)
        .then((res) => {
          setProfile(editProfile);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const ProfileEditIcon = () => {
    return (
      <div className="icon">
        <EditIcon
          width="100%"
          height="100%"
          stroke={resolvedTheme == "dark" ? "#fff" : "#000"}
        />
      </div>
    );
  };

  return (
    <div className="profile">
      <div className="profile-image">
        <img
          src={"/images/ryan-riggins-216051.jpg"}
          alt="profile"
          onError={onErrorImg}
        />
      </div>
      <div className="profile-username">
        <p>{profile?.username}</p>
      </div>
      <div className="profile-about">
        {editMode ? (
          <>
            <textarea
              ref={textarea}
              rows={2}
              value={editProfile.about}
              onChange={(e) => handleResizeHeight(e, setEditProfile)}
            />
            <button onClick={(e) => handleEdit(e)}>
              <Tooltip
                content="Save"
                style={resolvedTheme == "dark" ? "dark" : "light"}
              >
                <ProfileEditIcon />
              </Tooltip>
            </button>
          </>
        ) : (
          <>
            <p>{profile?.about}</p>
            {authDto?.role === "ADMIN" ? (
              <button onClick={(e) => handleEdit(e)}>
                <Tooltip
                  content="Edit"
                  style={resolvedTheme == "dark" ? "dark" : "light"}
                >
                  <ProfileEditIcon />
                </Tooltip>
              </button>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;
