import React from "react";

import './UserMenu.scss';
import { authAtom } from "recoil/authAtom";
import { useRecoilState } from "recoil";
import { Link } from "react-router-dom";

function UserMenu() {
  const [authDto, ] = useRecoilState(authAtom);

  if (authDto.isLogin === false) {
    return (
      <div className="usermenu button">
        <Link to="/login">로그인</Link>
      </div>
    )
  }

  return (
    <div  className="usermenu">
      <div>ㅎㅎ</div>
    </div>
  )
}

export default UserMenu;