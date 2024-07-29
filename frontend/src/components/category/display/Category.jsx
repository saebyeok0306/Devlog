import React, { useEffect, useState } from "react";

import "./Category.scss";
import FolderIcon from "assets/icons/Folder";
import { useRecoilState, useRecoilValue } from "recoil";
import { themeAtom } from "recoil/themeAtom";
import { get_categories_api } from "api/Category";
import { GetPayload } from "utils/authenticate";
import EditIcon from "assets/icons/Edit";
import { Tooltip } from "flowbite-react";
import { Link } from "react-router-dom";
import { authAtom } from "recoil/authAtom";
import { categoryAtom } from "recoil/categoryAtom";

function Category() {
  const payload = GetPayload();
  const [isDark] = useRecoilState(themeAtom);
  const authDto = useRecoilValue(authAtom);
  const [selectCategory, setSelectCategory] = useRecoilState(categoryAtom);
  const [list, setList] = useState([]); // 렌더될 요소

  useEffect(() => {
    get_categories_api()
      .then((res) => {
        setList(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [authDto]);

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

  const CategoryEditIcon = () => {
    return (
      <div className="icon">
        <EditIcon
          width="100%"
          height="100%"
          stroke={isDark ? "#fff" : "#000"}
        />
      </div>
    );
  };

  return (
    <div className="category">
      <p className="title">Category</p>
      <ul>
        <li className="category-all">
          <button
            className="category-item"
            onClick={() => setSelectCategory("ALL")}
          >
            <CategoryIcon />
            <p>전체글보기</p>
          </button>
          {payload.role === "ADMIN" ? (
            <Link to="/manager/category">
              <Tooltip content="Edit" style={isDark ? "dark" : "light"}>
                <CategoryEditIcon />
              </Tooltip>
            </Link>
          ) : null}
        </li>
        {list.map((item, idx) => (
          <li key={idx} draggable={false} data-position={idx}>
            <button
              className="category-item"
              onClick={() => setSelectCategory(item?.name ? item.name : "ALL")}
            >
              <CategoryIcon />
              <p>{`${item?.name}`}</p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Category;
