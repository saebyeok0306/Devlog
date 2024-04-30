import React from "react";
import Responsive from "../common/Responsive";

import './Main.scss';
import Posts from "../posts/Posts";


function Main({LeftSide, RightSide}) {
  return (
    <Responsive className="main">
      {LeftSide == null ? <aside/> : <LeftSide/>}
        <section>
          <Posts/>
        </section>
      {RightSide == null ? <aside/> : <RightSide/>}
    </Responsive>
  );
}

export default Main;