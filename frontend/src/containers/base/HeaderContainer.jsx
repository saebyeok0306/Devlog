import React from "react";
import Header from "components/base/header_/Header";
import UserMenu from "components/base/userMenu_";
import RightMenu from "components/rightMenu";

function HeaderContainer() {
  return <Header right={<RightMenu />} menu={<UserMenu />} />;
}

export default HeaderContainer;
