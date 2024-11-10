import React from "react";

import "./UserMenu.scss";
import { authAtom } from "@/recoil/authAtom";
import { useRecoilState } from "recoil";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Dropdown } from "flowbite-react";
import { signOut } from "@/utils/authenticate";

const onProfileHandler = (navigate) => {
  navigate("/profile");
};

const onLogoutHandler = (setAuthDto) => {
  signOut(setAuthDto);
};

function UserMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const [authDto, setAuthDto] = useRecoilState(authAtom);

  if (authDto?.isLogin === false) {
    return (
      <nav className="usermenu button">
        <Link to="/login" state={{ backpath: location.pathname }}>
          로그인
        </Link>
      </nav>
    );
  }

  return (
    <nav className="usermenu">
      <Dropdown label={`${authDto.username}님`} inline>
        <Dropdown.Item onClick={() => onProfileHandler(navigate)}>
          프로필
        </Dropdown.Item>
        {authDto.role === "ADMIN" ? (
          <Dropdown.Item>블로그</Dropdown.Item>
        ) : null}
        <Dropdown.Item onClick={() => onLogoutHandler(setAuthDto)}>
          로그아웃
        </Dropdown.Item>
      </Dropdown>
    </nav>
  );
}

export default UserMenu;
