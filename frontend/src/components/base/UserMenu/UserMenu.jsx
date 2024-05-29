import React from "react";

import "./UserMenu.scss";
import { authAtom } from "recoil/authAtom";
import { useRecoilState } from "recoil";
import { Link } from "react-router-dom";
import { Dropdown } from "flowbite-react";
import { signOut } from "utils/authenticate";

function UserMenu() {
  const [authDto, setAuthDto] = useRecoilState(authAtom);

  const handleLogout = () => {
    signOut(setAuthDto);
  };

  if (authDto.isLogin === false) {
    return (
      <nav className="usermenu button">
        <Link to="/login">로그인</Link>
      </nav>
    );
  }

  return (
    <nav className="usermenu">
      <Dropdown label={`${authDto.username}님`} inline>
        <Dropdown.Item>Dashboard</Dropdown.Item>
        <Dropdown.Item>Settings</Dropdown.Item>
        <Dropdown.Item>Earnings</Dropdown.Item>
        <Dropdown.Item onClick={() => handleLogout()}>Sign out</Dropdown.Item>
      </Dropdown>
    </nav>
  );
}

export default UserMenu;
