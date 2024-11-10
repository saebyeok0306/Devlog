import React from "react";
import PageTemplate from "@/components/common/pageTemplate";
import HeaderContainer from "@/containers/base/HeaderContainer";
import CategoryManagerContainer from "@/containers/main/CategoryManagerContainer";

function CategoryManager() {
  return (
    <PageTemplate>
      <HeaderContainer />
      <CategoryManagerContainer />
    </PageTemplate>
  );
}

export default CategoryManager;
