import React from 'react';
import Header from "components/base/Header/Header";
import UserMenu from 'components/base/UserMenu';


function HeaderContainer() {
  return (
    <Header
      right={<div>Right</div>}
      menu={<UserMenu/>}
    />
  );
}

export default HeaderContainer;