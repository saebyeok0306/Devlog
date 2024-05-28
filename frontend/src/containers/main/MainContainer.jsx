import React from "react";
import Main from "components/main";
import LeftSideContainer from "containers/side/LeftSideContainer";

function MainContainer() {
  return <Main LeftSide={LeftSideContainer} />;
}

export default MainContainer;
