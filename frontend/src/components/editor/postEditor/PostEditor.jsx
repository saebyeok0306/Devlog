import React, { useEffect } from "react";
import MDEditor, { commands } from "@uiw/react-md-editor";

import "./PostEditor.scss";
import { useRecoilState } from "recoil";
import { themeAtom } from "recoil/themeAtom";
import { Dropdown } from "flowbite-react";
import { get_categories_api } from "api/Category";

function PostEditor() {
  const [isDark] = useRecoilState(themeAtom);
  const [value, setValue] = React.useState();
  const [categories, setCategories] = React.useState([]);
  const [selectCategory, setSelectCategory] = React.useState();

  useEffect(() => {
    get_categories_api()
      .then((res) => {
        setCategories(res.data);
        setSelectCategory(res.data[0]);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const selectCategoryHandler = (category) => {
    setSelectCategory(category);
  };

  return (
    <div className="PostEditor" data-color-mode={isDark ? "dark" : "light"}>
      <div className="post-top">
        <input className="post-title" placeholder="글 제목을 입력하세요." />
        <div className="post-extra-menu">
          <button>글쓰기</button>
          <Dropdown className="dropdown" label={selectCategory?.name} inline>
            {categories.map((category, idx) => (
              <Dropdown.Item onClick={() => selectCategoryHandler(category)}>
                {category?.name}
              </Dropdown.Item>
            ))}
          </Dropdown>
        </div>
      </div>
      <MDEditor
        preview={window.innerWidth > 768 ? "live" : "edit"}
        style={{ flex: "1" }}
        value={value}
        onChange={setValue}
        height={"100%"}
        textareaProps={{
          placeholder: "Please enter Markdown text",
        }}
        commands={[
          commands.bold,
          commands.italic,
          commands.strikethrough,
          commands.hr,
          commands.group([commands.title2, commands.title3, commands.title4], {
            name: "title",
            groupName: "title",
            buttonProps: { "aria-label": "Insert title" },
          }),
          commands.divider,
          commands.link,
          commands.quote,
          commands.code,
          commands.codeBlock,
          commands.comment,
          commands.image,
          commands.table,
          commands.divider,
          commands.unorderedListCommand,
          commands.orderedListCommand,
          commands.checkedListCommand,
        ]}
      />
    </div>
  );
}

export default PostEditor;
