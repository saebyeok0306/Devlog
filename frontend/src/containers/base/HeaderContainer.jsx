import React from "react";
import Header from "components/base/Header/Header";
import UserMenu from "components/base/UserMenu";
import RightMenu from "components/RightMenu";

function HeaderContainer() {
  return (
    <Header
      right={<RightMenu />}
      menu={<UserMenu />}
    />
  );
}

export default HeaderContainer;
