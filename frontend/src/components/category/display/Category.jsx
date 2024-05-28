import React, { useEffect, useState } from "react";

import "./Category.scss";
import FolderIcon from "assets/icons/Folder";
import { useRecoilState } from "recoil";
import { themeAtom } from "recoil/themeAtom";
import { get_categories_api } from "api/Category";

function Category() {
  const [isDark] = useRecoilState(themeAtom);
  const [list, setList] = useState([]); // 렌더될 요소

  useEffect(() => {
    get_categories_api()
      .then((res) => {
        console.log(res);
        setList(res.data);
      })
      .catch((err) => {
        alert(err);
      });
  }, []);

  const CategoryIcon = () => {
    return (
      <div className="icon">
        <FolderIcon
          width="100%"
          height="100%"
          fill={isDark ? "#fff" : "#000"}
        />
      </div>
    );
  };

  return (
    <div className="category">
      <p className="title">Category</p>
      <ul>
        <li>
          <CategoryIcon />
          <p>전체글보기</p>
        </li>
        {list.map((item, idx) => (
          <li key={idx} draggable={false} data-position={idx}>
            <CategoryIcon />
            <p>{`${item?.name}`}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Category;
