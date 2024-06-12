import React from "react";
import Header from "components/base/header/Header";
import UserMenu from "components/base/userMenu";
import RightMenu from "components/rightMenu";

function HeaderContainer() {
  return <Header right={<RightMenu />} menu={<UserMenu />} />;
}

export default HeaderContainer;
