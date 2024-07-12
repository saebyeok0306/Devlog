import React, { useEffect, useRef, useState } from "react";
import MDEditor, { commands, insertTextAtPosition } from "@uiw/react-md-editor";

import "./PostEditor.scss";
import { useRecoilState } from "recoil";
import { themeAtom } from "recoil/themeAtom";
import { Dropdown } from "flowbite-react";
import { get_categories_api } from "api/Category";
import Responsive from "components/common/Responsive";
import { upload_file_api } from "api/File";
import Publish from "./publish";
import { toast } from "react-toastify";
import FileUploader from "./fileUploader";
import UploadIcon from "assets/icons/Upload";

function PostEditor() {
  const editorRef = useRef(null);
  const [isDark] = useRecoilState(themeAtom);
  const [openModal, setOpenModal] = useState(false);

  const [title, setTitle] = useState();
  const [content, setContent] = useState();
  const [categories, setCategories] = useState([]);
  const [files, setFiles] = useState([]);
  const [selectCategory, setSelectCategory] = useState();
  const [preview, setPreview] = useState();

  const [openLoader, setOpenLoader] = useState(false);

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

  useEffect(() => {
    if (!preview) {
      setPreview(files[0]);
    } else {
      // files 중 content에 없는 이미지가 preview인 경우 다시 files에서 첫번째 항목으로 선택.
      if (
        content.indexOf(
          `(${process.env.REACT_APP_API_FILE_URL}/${preview.filePath}/${preview.fileUrl})`
        ) === -1
      ) {
        setPreview(files[0]);
      }
    }
    // eslint-disable-next-line
  }, [files]);

  const fileUploader = {
    name: "FileUploader",
    groupName: "FileUploader",
    icon: <UploadIcon />,
    children: (props) => (
      <FileUploader
        {...props}
        openLoader={openLoader}
        setOpenLoader={setOpenLoader}
        files={files}
        setFiles={setFiles}
      />
    ),
    execute: (state, api) => {
      setOpenLoader(true);
    },
    buttonProps: { "aria-label": "FileUploader" },
  };

  const selectCategoryHandler = (category) => {
    setSelectCategory(category);
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
        await upload_file_api(file)
          .then((res) => {
            console.log("파일전송 완료");
            const fileName = res.data.fileName.replace(/\.[^/.]+$/, "");
            insertTextAtPosition(
              editorRef.current.textarea,
              `![${fileName}](${process.env.REACT_APP_API_FILE_URL}/${res.data.filePath}/${res.data.fileUrl})\n`
            );
            setFiles([...files, res.data]);
          })
          .catch((err) => {
            console.error(err);
          });
      }
    }
  };

  const handlePaste = async (event) => {
    if (!editorRef.current) return;
    const clipboardData = event.clipboardData || window.clipboardData;
    if (clipboardData && clipboardData.items) {
      for (const item of clipboardData.items) {
        if (item.type.startsWith("image")) {
          event.preventDefault();
          const file = item.getAsFile();
          await upload_file_api(file)
            .then((res) => {
              console.log("파일전송 완료");
              const fileName = res.data.fileName.replace(/\.[^/.]+$/, "");
              insertTextAtPosition(
                editorRef.current.textarea,
                `![${fileName}](${process.env.REACT_APP_API_FILE_URL}/${res.data.filePath}/${res.data.fileUrl})\n`
              );
              setFiles([...files, res.data]);
            })
            .catch((err) => {
              console.error(err);
            });
        }
      }
    }
  };

  const publishHandler = (e) => {
    e.preventDefault();
    if (!title) {
      toast.error("제목을 입력해주세요.");
      return;
    }
    if (!content) {
      toast.error("내용을 입력해주세요.");
      return;
    }

    // files 중 content에 없는 파일은 files에서 제거
    setFiles(
      files.filter(
        (file) =>
          content.indexOf(
            `(${process.env.REACT_APP_API_FILE_URL}/${file.filePath}/${file.fileUrl})`
          ) !== -1
      )
    );

    setOpenModal(true);
  };

  return (
    <Responsive
      className="PostEditor"
      data-color-mode={isDark ? "dark" : "light"}
    >
      <div className="post-top">
        <input
          className="post-title"
          placeholder="글 제목을 입력하세요."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="post-extra-menu">
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
          <button onClick={(e) => publishHandler(e)}>발행하기</button>
        </div>
      </div>
      <MDEditor
        ref={editorRef}
        preview={window.innerWidth > 768 ? "live" : "edit"}
        style={{ flex: "1", whiteSpace: "pre-wrap" }}
        value={content}
        onChange={setContent}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onPaste={handlePaste}
        height={"100%"}
        textareaProps={{
          placeholder: "내용을 입력하세요.",
        }}
        commands={[
          commands.bold,
          commands.italic,
          commands.strikethrough,
          commands.hr,
          commands.group(
            [
              commands.title1,
              commands.title2,
              commands.title3,
              commands.title4,
            ],
            {
              name: "title",
              groupName: "title",
              buttonProps: { "aria-label": "Insert title" },
            }
          ),
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
          commands.divider,
          commands.group([], fileUploader),
        ]}
      />
      <Publish
        openModal={openModal}
        setOpenModal={setOpenModal}
        categories={categories}
        selectCategory={selectCategory}
        setSelectCategory={setSelectCategory}
        title={title}
        content={content}
        files={files}
        preview={preview}
        setPreview={setPreview}
      />
    </Responsive>
  );
}

export default PostEditor;
