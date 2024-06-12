import React, { useState } from "react";

import "./RightMenu.scss";
import { Auth, authAtom } from "recoil/authAtom";
import { useRecoilState } from "recoil";
import { Dropdown } from "flowbite-react";
import DarkIcon from "assets/icons/Dark";
import { setTheme, getThemeValue, themeAtom } from "recoil/themeAtom";
import LightIcon from "assets/icons/Light";
import ComputerIcon from "assets/icons/Computer";
import DotIcon from "assets/icons/Dot";

function RightMenu() {
  const [select, SetSelect] = useState(getThemeValue());
  const [authDto, setAuthDto] = useRecoilState(authAtom);
  const [isDark, setThemeMode] = useRecoilState(themeAtom);

  const fill = () => (isDark ? "#fff" : "#000");

  const Light = (prop) => {
    return <LightIcon width="1.4em" height="1.4em" fill={fill()} {...prop} />;
  };

  const Dark = (prop) => {
    return <DarkIcon width="1.4em" height="1.4em" stroke={fill()} {...prop} />;
  };

  const System = (prop) => {
    return (
      <ComputerIcon width="1.4em" height="1.4em" fill={fill()} {...prop} />
    );
  };

  const Dot = () => {
    return <DotIcon width="25px" height="25px" fill={fill()} />;
  };

  const DarkModeIcon = () => {
    return isDark ? <Dark /> : <Light />;
  };

  const SetThemeSetting = (flag) => {
    setThemeMode(setTheme(flag));
    SetSelect(getThemeValue());
  };

  const CommonMenu = () => {
    return (
      <>
        <nav>검색메뉴</nav>
        <nav>
          <Dropdown
            className="dropdown"
            label=""
            inline
            renderTrigger={() => (
              <button>
                <DarkModeIcon />
              </button>
            )}
          >
            <Dropdown.Item onClick={() => SetThemeSetting(0)}>
              <div>
                <Light style={{ marginRight: "0.5em" }} />
                Light
              </div>
              {select === 0 ? <Dot /> : null}
            </Dropdown.Item>
            <Dropdown.Item onClick={() => SetThemeSetting(1)}>
              <div>
                <Dark style={{ marginRight: "0.5em" }} />
                Dark
              </div>
              {select === 1 ? <Dot /> : null}
            </Dropdown.Item>
            <Dropdown.Item onClick={() => SetThemeSetting(2)}>
              <div>
                <System style={{ marginRight: "0.5em" }} />
                System
              </div>
              {select === 2 ? <Dot /> : null}
            </Dropdown.Item>
          </Dropdown>
        </nav>
      </>
    );
  };

  if (authDto.isLogin === false) {
    return (
      <div className="rightmenu">
        <CommonMenu />
      </div>
    );
  }

  return (
    <div className="rightmenu">
      <CommonMenu />
      <nav>로그인됨</nav>
    </div>
  );
}

export default RightMenu;
