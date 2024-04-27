import React from "react";

import './Category.scss';

const test = [1,2,3,4,5];

function Category() {
  return (
    <div className="category">
      카테고리 메뉴
      <ul>
        {test.map((val, idx) => (<li key={idx}>{`${val} 메뉴`}</li>))}
      </ul>
    </div>
  );
}

export default Category;