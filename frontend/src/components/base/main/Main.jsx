import React from "react";
import Responsive from "components/common/Responsive";

import "./Main.scss";

function Main({ LeftSide, MainContent, RightSide }) {
  return (
    <Responsive className="main">
      {LeftSide == null ? <aside /> : <LeftSide />}
      <section>
        <MainContent />
      </section>
      {RightSide == null ? <aside /> : <RightSide />}
    </Responsive>
  );
}

export default Main;
