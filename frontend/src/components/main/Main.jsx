import React from "react";
import Responsive from "../common/Responsive";

import './Main.scss';

function Main({LeftSide, RightSide}) {
  return (
    <Responsive className="main">
      <LeftSide/>
      <section>메인영역</section>
      {RightSide == null ? <aside>우측사이드</aside> : <RightSide/>}
    </Responsive>
  );
}

export default Main;