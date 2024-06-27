import React, { useEffect, useRef, useState } from "react";
import MDEditor, { commands, insertTextAtPosition } from "@uiw/react-md-editor";

import "./PostEditor.scss";
import { useRecoilState } from "recoil";
import { themeAtom } from "recoil/themeAtom";
import { Dropdown } from "flowbite-react";
import { get_categories_api } from "api/Category";
import Responsive from "components/common/Responsive";
import { upload_file_api } from "api/File";

function PostEditor() {
  const editorRef = useRef(null);
  const [isDark] = useRecoilState(themeAtom);
  const [value, setValue] = useState();
  const [categories, setCategories] = useState([]);
  const [selectCategory, setSelectCategory] = useState();

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

  const customButton = {
    name: "custom",
    keyCommand: "custom",
    buttonProps: { "aria-label": "custom" },
    icon: (
      <svg viewBox="0 0 1024 1024" width="12" height="12">
        <path
          fill="currentColor"
          d="M716.8 921.6a51.2 51.2 0 1 1 0 102.4H307.2a51.2 51.2 0 1 1 0-102.4h409.6zM475.8016 382.1568a51.2 51.2 0 0 1 72.3968 0l144.8448 144.8448a51.2 51.2 0 0 1-72.448 72.3968L563.2 541.952V768a51.2 51.2 0 0 1-45.2096 50.8416L512 819.2a51.2 51.2 0 0 1-51.2-51.2v-226.048l-57.3952 57.4464a51.2 51.2 0 0 1-67.584 4.2496l-4.864-4.2496a51.2 51.2 0 0 1 0-72.3968zM512 0c138.6496 0 253.4912 102.144 277.1456 236.288l10.752 0.3072C924.928 242.688 1024 348.0576 1024 476.5696 1024 608.9728 918.8352 716.8 788.48 716.8a51.2 51.2 0 1 1 0-102.4l8.3968-0.256C866.2016 609.6384 921.6 550.0416 921.6 476.5696c0-76.4416-59.904-137.8816-133.12-137.8816h-97.28v-51.2C691.2 184.9856 610.6624 102.4 512 102.4S332.8 184.9856 332.8 287.488v51.2H235.52c-73.216 0-133.12 61.44-133.12 137.8816C102.4 552.96 162.304 614.4 235.52 614.4l5.9904 0.3584A51.2 51.2 0 0 1 235.52 716.8C105.1648 716.8 0 608.9728 0 476.5696c0-132.1984 104.8064-239.872 234.8544-240.2816C258.5088 102.144 373.3504 0 512 0z"
        />
      </svg>
    ),
    execute: (state, api) => {
      let modifyText = `### ${state.selectedText}\n`;
      if (!state.selectedText) {
        modifyText = `### `;
      }
      api.replaceSelection(modifyText);
    },
  };

  const insertTextAtCursor = (text) => {
    console.log(editorRef);
    if (editorRef.current) {
      insertTextAtPosition(editorRef.current.textarea, text);
    }
  };

  const handleDrop = async (event) => {
    event.preventDefault();

    if (!editorRef.current) return;

    const className = event.target.className;
    if (
      !className.startsWith("w-md-editor-content") ||
      className.startsWith("w-md-editor-input")
    )
      return;

    console.log(event, event.dataTransfer?.files.length);
    if (event.dataTransfer.files.length === 1) {
      const file = event.dataTransfer.files[0];

      // image type check
      if (file && file.type.startsWith("image")) {
        // TODO: backend upload image
        await upload_file_api(file)
          .then((res) => {
            console.log("파일전송 완료");
            const fileName = res.data.fileName.replace(/\.[^/.]+$/, "");
            insertTextAtPosition(
              editorRef.current.textarea,
              `![${fileName}](${process.env.REACT_APP_API_ENDPOINT}/${res.data.filePath}/${res.data.fileUrl})\n`
            );
          })
          .catch((err) => {
            console.error(err);
          });
      }
    }
  };

  const handlePaste = async (event) => {
    event.preventDefault();
    if (!editorRef.current) return;
    const clipboardData = event.clipboardData || window.clipboardData;
    if (clipboardData && clipboardData.items) {
      for (const item of clipboardData.items) {
        if (item.type.startsWith("image")) {
          // TODO: backend upload image
          const file = item.getAsFile();
          await upload_file_api(file)
            .then((res) => {
              console.log("파일전송 완료");
              const fileName = res.data.fileName.replace(/\.[^/.]+$/, "");
              insertTextAtPosition(
                editorRef.current.textarea,
                `![${fileName}](${process.env.REACT_APP_API_ENDPOINT}/${res.data.filePath}/${res.data.fileUrl})\n`
              );
            })
            .catch((err) => {
              console.error(err);
            });
        }
      }
    }
  };

  return (
    <Responsive
      className="PostEditor"
      data-color-mode={isDark ? "dark" : "light"}
    >
      <div className="post-top">
        <input className="post-title" placeholder="글 제목을 입력하세요." />
        <div className="post-extra-menu">
          <button onClick={() => insertTextAtCursor("Hello World!")}>
            글쓰기
          </button>
          <Dropdown className="dropdown" label={selectCategory?.name} inline>
            {categories.map((category, idx) => (
              <Dropdown.Item
                key={idx}
                onClick={() => selectCategoryHandler(category)}
              >
                {category?.name}
              </Dropdown.Item>
            ))}
          </Dropdown>
        </div>
      </div>
      <MDEditor
        ref={editorRef}
        preview={window.innerWidth > 768 ? "live" : "edit"}
        style={{ flex: "1", whiteSpace: "pre-wrap" }}
        value={value}
        onChange={setValue}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onPaste={handlePaste}
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
          customButton,
        ]}
      />
    </Responsive>
  );
}

export default PostEditor;
