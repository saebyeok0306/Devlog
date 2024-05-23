import React, { useState } from "react";

import './RightMenu.scss';
import { Auth, authAtom } from "recoil/authAtom";
import { useRecoilState } from "recoil";
import { Dropdown } from "flowbite-react";
import DarkIcon from "assets/icons/Dark";
import { setTheme, themeAtom } from "recoil/themeAtom";
import LightIcon from "assets/icons/Light";
import ComputerIcon from "assets/icons/Computer";
import DotIcon from "assets/icons/Dot";

function getTheme() {
  return Number(localStorage.getItem('theme'));
}

function RightMenu() {
  const [select, SetSelect] = useState(getTheme());
  const [authDto, setAuthDto] = useRecoilState(authAtom);
  const [isDark, setThemeMode] = useRecoilState(themeAtom);

  const fill = () => isDark ? "#fff" : "#000";

  const Light = (prop) => {
    return (
      <LightIcon width="1.5em" height="1.5em" fill={fill()} {...prop} />
    )
  }

  const Dark = (prop) => {
    return (
      <DarkIcon width="1.5em" height="1.5em" stroke={fill()} {...prop}/>
    )
  }

  const System = (prop) => {
    return (
      <ComputerIcon width="1.5em" height="1.5em" fill={fill()} {...prop}/>
    )
  }

  const Dot = () => {
    return (
      <DotIcon width="25px" height="25px" fill={fill()}/>
    )
  }

  const DarkModeIcon = () => {
    return (isDark ? <Dark/> : <Light/>);
  }

  const SetThemeSetting = (flag) => {
    setThemeMode(setTheme(flag));
    SetSelect(getTheme());
  }

  const CommonMenu = () => {
    return (
      <>
        <div>검색메뉴</div>
        <Dropdown className="dropdown" label="" inline renderTrigger={() => <button><DarkModeIcon/></button>}>
          <Dropdown.Item onClick={() => SetThemeSetting(0)}>
            <item><Light style={{marginRight:"0.5em"}}/>Light</item>
            {select === 0 ? <Dot/> : null}
          </Dropdown.Item>
          <Dropdown.Item onClick={() => SetThemeSetting(1)}>
            <item><Dark style={{marginRight:"0.5em"}}/>Dark</item>
            {select === 1 ? <Dot/> : null}
          </Dropdown.Item>
          <Dropdown.Item onClick={() => SetThemeSetting(2)}>
            <item><System style={{marginRight:"0.5em"}}/>System</item>
            {select === 2 ? <Dot/> : null}
          </Dropdown.Item>
        </Dropdown>
      </>
    )
  };

  if (authDto.isLogin === false) {
    return (
      <div className="rightmenu">
        <CommonMenu/>
      </div> 
    )
  }

  return (
    <div className="rightmenu">
      <CommonMenu/>
      <div>로그인됨</div>
    </div>
  )
}

export default RightMenu;