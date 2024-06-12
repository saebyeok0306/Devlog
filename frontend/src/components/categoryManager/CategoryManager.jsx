import React from "react";
import Responsive from "components/common/Responsive";

import "./CategoryManager.scss";
import EditCategory from "components/category/edit/EditCategory";

function CategoryManager({ LeftSide, RightSide }) {
  return (
    <Responsive className="main">
      {LeftSide == null ? <aside /> : <LeftSide />}
      <section>
        <EditCategory />
      </section>
      {RightSide == null ? <aside /> : <RightSide />}
    </Responsive>
  );
}

export default CategoryManager;
