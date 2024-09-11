import React from "react";
import Main from "components/common/main";
import LeftSideContainer from "containers/side/LeftSideContainer";

function ProfileContainer() {
  return <Main LeftSide={LeftSideContainer} MainContent={<div />} />;
}

export default ProfileContainer;
