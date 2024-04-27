import React from 'react';
import Header from "../../components/base/Header/Header";


function HeaderContainer() {
  return (
    <Header
      right={<div>Right</div>}
      menu={<div>UserMenu</div>}
    />
  );
}

export default HeaderContainer;