import React, { memo, useCallback, useState } from "react";

import "./Comment.scss";
import { Dropdown, Timeline } from "flowbite-react";
import { HiAnnotation } from "react-icons/hi";
import { timelineCustomTheme } from "styles/theme/timeline";
import CommentEditor from "components/editor/commentEditor";
import { useRecoilState, useRecoilValue } from "recoil";
import { themeAtom } from "recoil/themeAtom";
import { getDatetime } from "utils/getDatetime";
import { authAtom } from "recoil/authAtom";
import { replyAtom } from "recoil/replyAtom";
import { edit_comment_api, upload_comment_api } from "api/Comment";
import { postAtom } from "recoil/postAtom";
import { toast } from "react-toastify";
import MDEditor from "@uiw/react-md-editor";

function Comment({ ...props }) {
  const { commentRef, comments } = props;
  const [isDark] = useRecoilState(themeAtom);
  const [authDto] = useRecoilState(authAtom);
  const [replyFlag, setReplyFlag] = useState(false);
  const [replyEditId, setReplyEditId] = useState(null);
  const [replyTargetComment, setReplyTargetComment] = useState(null);
  const [commentFiles, setCommentFiles] = useState([]);
  const postContent = useRecoilValue(postAtom);

  const [editorContent, setEditorContent] = useState("");
  const [editorFiles, setEditorFiles] = useState([]);

  const addClientComment = (targetId, comment) => {
    let isEdit = false;
    for (let i = 0; i < comments.length; i++) {
      if (isEdit) break;
      const parent = comments[i];
      if (parent.id === targetId) {
        if (!parent.children) parent.children = [];
        comment["parentData"] = parent;
        comment["root"] = parent.id;
        parent.children.push(comment);
        break;
      }
      if (!parent.children) continue;
      for (let j = 0; j < parent.children.length; j++) {
        const child = parent.children[j];
        if (child.id === targetId) {
          comment["parentData"] = child;
          comment["root"] = parent.id;
          parent.children.push(comment);
          isEdit = true;
          break;
        }
      }
    }
  };

  const uploadCommentHandler = async (
    targetComment,
    content,
    files,
    isPrivate
  ) => {
    try {
      const result = await upload_comment_api(
        postContent,
        targetComment ? targetComment.id : 0,
        content,
        files,
        isPrivate
      );
      const comment = result.data;
      if (targetComment) {
        addClientComment(targetComment.id, comment);
        cancelEditHandler();
      } else {
        comments.push(comment);
        setEditorContent("");
        setEditorFiles([]);
      }

      toast.info("댓글이 등록되었습니다.");
      return true;
    } catch (err) {
      return false;
    }
  };

  const onReplyHandler = (targetComment, setContent) => {
    setReplyFlag(true);
    let root = targetComment?.root;
    if (!root) root = targetComment.id;
    if (replyEditId !== root) {
      setReplyEditId(root);
      setContent("");
      setCommentFiles([]);
    }
    setReplyTargetComment(targetComment);
  };

  const onEditHandler = useCallback((comment, setContent) => {
    setReplyFlag(false);
    setReplyEditId(comment.id);
    setContent(comment.content);
    setCommentFiles([]);
  }, []);

  const cancelEditHandler = () => {
    setReplyFlag(false);
    setReplyEditId(null);
    setReplyTargetComment(null);
    setCommentFiles([]);
    // setReplyComment("");
  };

  const updateClientComment = (targetId, editContent, editIsPrivate) => {
    let isEdit = false;
    for (let i = 0; i < comments.length; i++) {
      if (isEdit) break;
      const parent = comments[i];
      if (parent.id === targetId) {
        parent.content = editContent;
        parent.isPrivate = editIsPrivate;
        break;
      }
      if (!parent.children) continue;
      for (let j = 0; j < parent.children.length; j++) {
        const child = parent.children[j];
        if (child.id === targetId) {
          child.content = editContent;
          child.isPrivate = editIsPrivate;
          isEdit = true;
          break;
        }
      }
    }
  };

  const updateEditHandler = async (comment, editContent, editIsPrivate) => {
    try {
      await edit_comment_api(
        comment.id,
        editContent,
        commentFiles,
        comment.isPrivate
      );
      updateClientComment(comment.id, editContent, editIsPrivate);
      cancelEditHandler();
      return true;
    } catch (err) {
      return false;
    }
  };

  const Comments = memo(() => {
    const [content, setContent] = useRecoilState(replyAtom);
    return (
      <>
        {comments.map((comment, idx) => (
          <div key={idx}>
            <CommentBox
              comment={comment}
              content={content}
              setContent={setContent}
            />
            {comment.children &&
              comment.children.map((child, idx2) => (
                <CommentBox
                  key={idx2 + 10000}
                  comment={child}
                  content={content}
                  setContent={setContent}
                />
              ))}
            {replyFlag === true && replyEditId === comment.id ? (
              <CommentReply
                rootComment={comment}
                content={content}
                setContent={setContent}
                onCancel={cancelEditHandler}
                onSave={uploadCommentHandler}
              />
            ) : null}
          </div>
        ))}
      </>
    );
  });

  const CommentReply = ({
    rootComment,
    content,
    setContent,
    onCancel,
    onSave,
  }) => {
    const replyComment = replyTargetComment;
    return (
      <Timeline.Item className={"comment create-reply"}>
        <Timeline.Point icon={HiAnnotation} />
        <Timeline.Content>
          <Timeline.Time className="comment-user">
            <div>{`${authDto.username}님`}</div>
          </Timeline.Time>
          <Timeline.Body className="comment-content">
            <div className="comment-content-body">
              <p className="comment-reply-name">
                @{replyComment.user.username}
              </p>
            </div>
            <CommentEditor
              content={content}
              setContent={setContent}
              files={commentFiles}
              setFiles={setCommentFiles}
              onCancel={onCancel}
              onSave={() => onSave(replyComment, content, commentFiles, false)}
            />
          </Timeline.Body>
        </Timeline.Content>
      </Timeline.Item>
    );
  };

  const CommentBox = ({ comment, content, setContent }) => {
    const isReply = comment.parent ? true : false;
    return (
      <Timeline.Item className={isReply ? "comment reply" : "comment"}>
        <Timeline.Point
          icon={HiAnnotation}
          theme={isReply ? pointerTheme : null}
        >
          {isReply ? (
            <div className="comment-reply-line">
              <div className="border-t border-gray-200 dark:border-gray-700 top-3 -left-6" />
            </div>
          ) : null}
        </Timeline.Point>
        <Timeline.Content>
          {replyFlag === false && replyEditId === comment.id ? (
            <CommentEdit
              comment={comment}
              onCancel={cancelEditHandler}
              onSave={updateEditHandler}
              content={content}
              setContent={setContent}
            />
          ) : (
            <CommentView
              comment={comment}
              onEdit={onEditHandler}
              onReply={onReplyHandler}
              content={content}
              setContent={setContent}
            />
          )}
        </Timeline.Content>
      </Timeline.Item>
    );
  };

  const CommentView = memo(
    ({ comment, onEdit, onReply, content, setContent }) => {
      const CommentToolbar = () => {
        if (comment.user.email === authDto.email) {
          return (
            <>
              <Dropdown label="" inline>
                <Dropdown.Item onClick={() => onEdit(comment, setContent)}>
                  수정
                </Dropdown.Item>
                <Dropdown.Item>삭제</Dropdown.Item>
              </Dropdown>
            </>
          );
        }
        return null;
      };
      return (
        <>
          <Timeline.Time className="comment-user">
            <div>{`${comment.user?.username}님`}</div>
            <div className="text-gray-900 dark:text-gray-400 comment-menu">
              <CommentToolbar />
            </div>
          </Timeline.Time>
          <Timeline.Body className="comment-content">
            {comment?.parent ? (
              <div className="comment-content-body">
                <p className="comment-reply-name">
                  @{comment.parentData.user.username}
                </p>
                <MDEditor.Markdown
                  className="comment-md-content"
                  source={comment.content}
                  style={{
                    flex: "1",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    backgroundColor: "inherit",
                  }}
                />
                {/* {comment.content} */}
              </div>
            ) : (
              <div className="comment-content-body">
                <MDEditor.Markdown
                  className="comment-md-content"
                  source={comment.content}
                  style={{
                    flex: "1",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    backgroundColor: "inherit",
                  }}
                />
              </div>
            )}
            <div className="comment-content-footer">
              <time dateTime={comment.createdAt}>
                {getDatetime(comment.createdAt)}
              </time>
              <button onClick={() => onReply(comment, setContent)}>답글</button>
            </div>
          </Timeline.Body>
        </>
      );
    }
  );

  const CommentEdit = memo(
    ({ comment, onCancel, onSave, content, setContent }) => {
      return (
        <>
          <CommentEditor
            content={content}
            setContent={setContent}
            files={commentFiles}
            setFiles={setCommentFiles}
            onCancel={onCancel}
            onSave={() => onSave(comment, content, comment.isPrivate)}
          />
        </>
      );
    }
  );

  return (
    <div
      ref={commentRef}
      className="comment-container"
      data-color-mode={isDark ? "dark" : "light"}
    >
      <Timeline className="comments" theme={timelineCustomTheme}>
        <Comments />
      </Timeline>
      {/* Post Comment Editor */}
      <CommentEditor
        content={editorContent}
        setContent={setEditorContent}
        files={editorFiles}
        setFiles={setEditorFiles}
        onSave={() =>
          uploadCommentHandler(null, editorContent, editorFiles, false)
        }
      />
    </div>
  );
}

const pointerTheme = {
  horizontal: "flex items-center",
  line: "hidden h-0.5 w-full bg-gray-200 dark:bg-gray-700 sm:flex",
  marker: {
    base: {
      horizontal:
        "absolute -left-1.5 h-3 w-3 rounded-full border border-white bg-gray-200 dark:border-gray-900 dark:bg-gray-700",
      vertical:
        "absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-200 dark:border-gray-900 dark:bg-gray-700",
    },
    icon: {
      base: "h-3 w-3 text-yellow-600 dark:text-yellow-300",
      wrapper:
        "absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-200 dark:bg-yellow-900",
    },
  },
  vertical: "",
};

export default Comment;
