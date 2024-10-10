import React, { useEffect, useRef, useState } from "react";

import "./Profile.scss";
import { useRecoilState } from "recoil";
import { authAtom } from "recoil/authAtom";
import { Button } from "flowbite-react";
import { onErrorImg } from "utils/defaultImg";

import ImageCrop from "./imageCrop";
import {
  ProfileEmail,
  ProfilePassword,
  ProfileUnregister,
} from "./profileItem";
import { signOutProcess } from "utils/authenticate";
import { toast } from "react-toastify";
import { delete_profile_url_api, user_profile_api } from "api/User";

function Profile() {
  const fileInputRef = useRef(null);
  const profileImageRef = useRef(null);
  const [authDto, setAuthDto] = useRecoilState(authAtom);
  const [userProfile, setUserProfile] = useState({
    loading: true,
    username: "",
    email: "",
    profileUrl: "",
    role: "",
    provider: null,
    certificate: false,
  });
  // const [profileUrl, setProfileUrl] = useState(authDto.profileUrl);

  const [imageCrop, setImageCrop] = useState({
    openModal: false,
    targetImage: null,
    targetUrl: null,
    targetSrc: null,
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        let payload = await user_profile_api();
        payload = payload.data;
        setUserProfile({ ...userProfile, ...payload, loading: false });
      } catch (error) {
        toast.error("프로필 정보를 불러오는데 실패했습니다.");
        signOutProcess(setAuthDto);
      }
    };

    fetchUserProfile();
  }, [authDto]);

  console.log("프로필 정보:", userProfile);
  const uploadImageHandler = () => {
    fileInputRef.current.click();
  };

  const removeImageHandler = () => {
    try {
      delete_profile_url_api();
      setAuthDto({ ...authDto, profileUrl: null });
      setUserProfile({ ...userProfile, profileUrl: null });
    } catch (error) {
      toast.error("요청을 처리하는데 실패했습니다.");
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0]; // fileInputRef.current.files[0]
    if (file) {
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImageCrop({
          ...imageCrop,
          openModal: true,
          // targetImage: file,
          // targetUrl: URL.createObjectURL(file),
          targetSrc: reader.result?.toString() || "",
        })
      );
      reader.readAsDataURL(file);
      // const upload_url = URL.createObjectURL(file);
      // setProfileUrl(upload_url);
      console.log("파일 선택됨:", file);
      event.target.value = null;
    }
  };

  return (
    <div className="profile-container">
      <ImageCrop
        imageCrop={imageCrop}
        setImageCrop={setImageCrop}
        setUserProfile={setUserProfile}
        setAuthDto={setAuthDto}
      />
      <header className="profile-header">
        <div className="profile-info-box">
          <div className="profile-info-username">{authDto.username}</div>
          <div className="profile-info-email">{authDto.email}</div>
        </div>
        <div className="profile-info-hr border-gray-300 dark:border-gray-500" />
        <div className="profile-image-box">
          <div className="profile-image">
            <img
              ref={profileImageRef}
              src={
                userProfile.profileUrl === null ? "" : userProfile.profileUrl
              }
              alt="user-profile"
              onError={onErrorImg}
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>
          <div className="profile-buttons">
            <Button onClick={uploadImageHandler}>이미지 업로드</Button>
            <Button color="gray" onClick={removeImageHandler}>
              이미지 삭제
            </Button>
          </div>
        </div>
      </header>
      <hr className="border-gray-300 dark:border-gray-500" />
      <div className="profile-body">
        <ProfileEmail
          userProfile={userProfile}
          setUserProfile={setUserProfile}
        />
        <hr className="border-gray-300 dark:border-gray-500" />
        <ProfilePassword userProfile={userProfile} />
        <hr className="border-gray-300 dark:border-gray-500" />
        <ProfileUnregister userProfile={userProfile} />
      </div>
    </div>
  );
}

export default Profile;
