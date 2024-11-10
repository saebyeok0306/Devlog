import React from "react";
import PageTemplate from "@/components/common/pageTemplate";
import HeaderContainer from "@/containers/base/HeaderContainer";
import ProfileContainer from "@/containers/profile/ProfileContainer";

function Profile() {
  return (
    <PageTemplate>
      <HeaderContainer />
      <ProfileContainer />
    </PageTemplate>
  );
}

export default Profile;
