import React from "react";
import Responsive from "components/common/Responsive";

import "./Main.scss";

function Main({ LeftSide, MainContent, RightSide, ...props }) {
  return (
    <Responsive className="main">
      {LeftSide == null ? <aside /> : <LeftSide {...props} />}
      <section>
        <MainContent {...props} />
      </section>
      {RightSide == null ? <aside /> : <RightSide {...props} />}
    </Responsive>
  );
}

export default Main;
