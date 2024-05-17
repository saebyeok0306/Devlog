import React from "react";

import './UserMenu.scss';
import { Auth, authAtom } from "recoil/authAtom";
import { useRecoilState } from "recoil";
import { Link } from "react-router-dom";
import { Dropdown } from "flowbite-react";
import { removeCookie } from "utils/useCookie";

function UserMenu() {
  const [authDto, setAuthDto] = useRecoilState(authAtom);

  const handleLogout = () => {
    alert("로그아웃 했습니다.");
    setAuthDto(new Auth());
    removeCookie("access_token");
    removeCookie("refresh_token");
  }

  if (authDto.isLogin === false) {
    return (
      <div className="usermenu button">
        <Link to="/login">로그인</Link>
      </div>
    )
  }

  return (
    <div className="usermenu">
      <Dropdown label={`${authDto.username}님`} inline>
        <Dropdown.Item>Dashboard</Dropdown.Item>
        <Dropdown.Item>Settings</Dropdown.Item>
        <Dropdown.Item>Earnings</Dropdown.Item>
        <Dropdown.Item onClick={() => handleLogout()}>Sign out</Dropdown.Item>
      </Dropdown>
    </div>
  )
}

export default UserMenu;