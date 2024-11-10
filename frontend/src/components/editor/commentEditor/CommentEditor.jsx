import React, { useEffect, useRef, useState } from "react";

import "./CommentEditor.scss";
import { toast } from "react-toastify";
import { ClassicEditor } from "ckeditor5";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  commentEditorConfig,
  CustomCommentUploadAdapter,
} from "./ClassicEditor";
import hljs from "highlight.js";
import { useRecoilState } from "recoil";
import { commentFilesAtom } from "@/recoil/commentAtom";

function CommentEditor({ comment, setComment, onCancel, onSave, setUpdater }) {
  const MAX_LENGTH = 5000;
  const editorRef = useRef(null);

  const [editorInstance, setEditorInstance] = useState(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const [throttle, setThrottle] = useState(false);
  const [commentFiles, setCommentFiles] = useRecoilState(commentFilesAtom);

  useEffect(() => {
    setIsLayoutReady(true);
    return () => {
      setIsLayoutReady(false);
    };
  }, []);

  useEffect(() => {
    if (editorInstance && comment.content) {
      editorInstance.setData(comment.content);
    }
    // eslint-disable-next-line
  }, [editorInstance]);

  const handleChangeContent = async (editor) => {
    const content = editor.getData();
    if (content.length <= MAX_LENGTH) {
      await setComment({ ...comment, content: content });
    } else {
      const newContent = content.slice(0, MAX_LENGTH);
      await setComment({ ...comment, content: newContent });
      editor.setData(newContent);
      if (throttle) return;
      if (!throttle) {
        await setThrottle(true);
        await setTimeout(async () => {
          toast.info(`최대 ${MAX_LENGTH}자까지 입력 가능합니다.`, {
            position: "bottom-center",
          });
          setThrottle(false);
        }, 1000);
      }
    }
  };

  const onSaveHandler = async () => {
    if (comment.content.length === 0) {
      toast.info("댓글 내용을 입력해주세요.");
      return;
    }

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = comment.content;

    // <pre><code> 태그에 하이라이트 적용
    tempDiv.querySelectorAll("pre code").forEach((block) => {
      hljs.highlightElement(block);
    });

    const fileFilter = (file) => {
      return (
        comment.content.indexOf(
          `${import.meta.env.VITE_API_FILE_URL}/${file.filePath}/${file.fileUrl}`
        ) !== -1 || file.fileType === "VIDEO"
      );
    };
    const newFiles = commentFiles.filter((file) => fileFilter(file));

    await setComment({ ...comment, content: tempDiv.innerHTML });

    editorInstance.setData("");
    await onSave(tempDiv.innerHTML, newFiles);
    await setUpdater((prev) => prev + 1);
  };

  const onCancelHandler = async () => {
    editorInstance.setData("");
    await setCommentFiles([]);
    await onCancel();
  };

  return (
    <div className="editor-container comment-editor">
      <div className="editor-container__editor">
        {isLayoutReady && (
          <CKEditor
            ref={editorRef}
            className="ck-editor-container"
            editor={ClassicEditor}
            config={commentEditorConfig}
            onReady={(editor) => {
              setEditorInstance(editor);
              editor.plugins.get("FileRepository").createUploadAdapter = (
                loader
              ) => {
                return new CustomCommentUploadAdapter(loader, setCommentFiles);
              };
            }}
            onChange={(event, editor) => {
              handleChangeContent(editor);
            }}
          />
        )}
      </div>
      <div className="comment-editor-bottom">
        <span>
          {comment.content.length}/{MAX_LENGTH}
        </span>
        {onSave ? <button onClick={onSaveHandler}>등록</button> : null}
        {onCancel ? <button onClick={onCancelHandler}>취소</button> : null}
      </div>
    </div>
  );
}

export default CommentEditor;
