import React from "react";

import './Profile.scss';
// import profile_img from '../../assets/profile.jpg';

function Profile() {
  return (
    <div className="profile">
      <div className="square-image">
        <img src={"/assets/profile.jpg"} alt="profile" />
      </div>
      <div>프로필</div>
    </div>
  );
}

export default Profile;