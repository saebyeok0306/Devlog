import React from "react";

import './RightMenu.scss';
import { Auth, authAtom } from "recoil/authAtom";
import { useRecoilState } from "recoil";
import { Link } from "react-router-dom";
import { Dropdown } from "flowbite-react";
import { removeCookie } from "utils/useCookie";

function RightMenu() {
  const [authDto, setAuthDto] = useRecoilState(authAtom);

  if (authDto.isLogin === false) {
    return (
      <div className="rightmenu">
        로그인안함
      </div> 
    )
  }

  return (
    <div className="rightmenu">
      로그인됨
    </div>
  )
}

export default RightMenu;