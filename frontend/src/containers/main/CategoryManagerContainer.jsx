import React from "react";
import LeftSideContainer from "containers/side/LeftSideContainer";
import CategoryManager from "components/categoryManager";

function CategoryManagerContainer() {
  return <CategoryManager LeftSide={LeftSideContainer} />;
}

export default CategoryManagerContainer;
