import React from "react";

import './Profile.scss';
// import profile_img from '../../assets/profile.jpg';

function Profile() {
  return (
    <div className="profile">
      <img src={"/assets/profile.jpg"} alt="profile" />
      <div>프로필</div>
    </div>
  );
}

export default Profile;