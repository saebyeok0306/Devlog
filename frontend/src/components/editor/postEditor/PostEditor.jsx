import React, { useEffect, useRef, useState } from "react";
import MDEditor, { commands } from "@uiw/react-md-editor";
import rehypeVideo from "rehype-video";

import "./PostEditor.scss";
import { useRecoilValue } from "recoil";
import { themeAtom } from "recoil/themeAtom";
import { Button, Dropdown } from "flowbite-react";
import { get_categories_readwrite_api } from "api/Category";
import Responsive from "components/common/Responsive";
import { upload_file_api } from "api/File";
import Publish from "./publish";
import { toast } from "react-toastify";
import FileUploader from "./fileUploader";
import UploadIcon from "assets/icons/Upload";
import { authAtom } from "recoil/authAtom";
import { useNavigate } from "react-router-dom";

const ReturnInsertText = ({ ref, content, text }) => {
  if (!ref.current.textarea) return null;
  if (content == null) return text;
  const textarea = ref.current.textarea;
  const { selectionStart, selectionEnd } = textarea;
  const newContent =
    content.substring(0, selectionStart) +
    text +
    content.substring(selectionEnd);
  return newContent;
};

const UploadFileAndInsertText = async ({
  ref,
  apiResult,
  content,
  setContent,
  setFiles,
}) => {
  const fileName = apiResult.fileName.replace(/\.[^/.]+$/, "");
  const text = `![${fileName}](${process.env.REACT_APP_API_FILE_URL}/${apiResult.filePath}/${apiResult.fileUrl})\n`;
  const newContent = ReturnInsertText({
    ref: ref,
    content: content,
    text: text,
  });
  await setContent(newContent);
  await setFiles((prev) => [...prev, apiResult]);
};

function PostEditor() {
  const editorRef = useRef(null);
  const navigate = useNavigate();
  const authDto = useRecoilValue(authAtom);
  const isDark = useRecoilValue(themeAtom);
  const [openModal, setOpenModal] = useState(false);

  const [title, setTitle] = useState(null);
  const [content, setContent] = useState(null);
  const [categories, setCategories] = useState([]);
  const [files, setFiles] = useState([]);
  const [selectCategory, setSelectCategory] = useState();
  const [preview, setPreview] = useState();

  const [openLoader, setOpenLoader] = useState(false);

  const MAX_LENGTH = 50000;

  useEffect(() => {
    get_categories_readwrite_api()
      .then((res) => {
        const response_categories = res.data;
        if (response_categories.length === 0) {
          toast.warning("글을 작성할 수 있는 카테고리가 없습니다!");
          return navigate(-1);
        }

        setCategories(res.data);
        setSelectCategory(res.data[0]);
      })
      .catch((err) => {
        console.error(err);
      });
    // eslint-disable-next-line
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

  const contentChangeHandler = (value) => {
    let change_text = value;
    if (change_text.length > MAX_LENGTH) {
      return;
    }
    setContent(change_text);
  };

  const selectCategoryHandler = (category) => {
    setSelectCategory(category);
  };

  const handleDrop = async (event) => {
    event.preventDefault();

    if (!editorRef.current) return;

    const className = event.target.className;
    if (
      !className.startsWith("w-md-editor-content") ||
      className.startsWith("w-md-editor-preview")
    )
      return;

    if (event.dataTransfer.files.length === 1) {
      const file = event.dataTransfer.files[0];

      if (!file) return;

      // image type check
      if (file.type.startsWith("image")) {
        await upload_file_api(file)
          .then(async (res) => {
            await UploadFileAndInsertText({
              ref: editorRef,
              apiResult: res.data,
              content: content,
              setContent: setContent,
              setFiles: setFiles,
            });
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
            .then(async (res) => {
              await UploadFileAndInsertText({
                ref: editorRef,
                apiResult: res.data,
                content: content,
                setContent: setContent,
                setFiles: setFiles,
              });
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

  if (categories.length === 0) {
    return <></>;
  }

  return (
    <Responsive
      className="PostEditor"
      data-color-mode={isDark ? "dark" : "light"}
    >
      <div className="post-top outline outline-[#d0d7de] dark:outline-[#30363d] bg-[#ffffff] dark:bg-[#0d1117]">
        <input
          className="post-title"
          placeholder="글 제목을 입력하세요."
          value={title || ""}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <MDEditor
        ref={editorRef}
        preview={window.innerWidth > 768 ? "live" : "edit"}
        style={{ flex: "1", whiteSpace: "pre-wrap" }}
        value={content || ""}
        onChange={(e) => contentChangeHandler(e)}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onPaste={handlePaste}
        height={"100%"}
        textareaProps={{
          placeholder: "내용을 입력하세요.",
        }}
        previewOptions={{
          rehypePlugins: [[rehypeVideo, { test: /\/(.*)(.mp4|.mov)$/ }]],
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
      <Button
        className="post-editor-publish-btn outline outline-[#d0d7de] dark:outline-[#30363d]"
        color="gray"
        onClick={(e) => publishHandler(e)}
      >
        발행하기
      </Button>
      <Publish
        openModal={openModal}
        setOpenModal={setOpenModal}
        authDto={authDto}
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

/*
<MDEditor.Markdown
  rehypePlugins={[[rehypeVideo]]}
/>
*/

export default PostEditor;
