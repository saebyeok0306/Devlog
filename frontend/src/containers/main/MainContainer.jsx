import React from "react";
import Main from "../../components/main";
import LeftSideContainer from "../side/LeftSideContainer";


function MainContainer() {
  return (
    <Main
      LeftSide={LeftSideContainer}
    />
  )
}

export default MainContainer;