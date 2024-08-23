import React, { memo, useCallback, useState } from "react";

import "./Comment.scss";
import { Dropdown, Timeline } from "flowbite-react";
import { HiAnnotation } from "react-icons/hi";
import { timelineCustomTheme } from "styles/theme/timeline";
import CommentEditor from "components/editor/commentEditor";
import { useRecoilState } from "recoil";
import { themeAtom } from "recoil/themeAtom";
import { getDatetime } from "utils/getDatetime";
import { authAtom } from "recoil/authAtom";
import { replyAtom } from "recoil/replyAtom";

function Comment({ ...props }) {
  const { commentRef, comments } = props;
  const [isDark] = useRecoilState(themeAtom);
  const [authDto] = useRecoilState(authAtom);
  const [replyEditId, setReplyEditId] = useState(null);
  // const [replyComment, setReplyComment] = useState("");

  const toggleEditHandler = useCallback((comment, setContent) => {
    setReplyEditId(comment.id);
    setContent(comment.content);
  }, []);

  const cancelEditHandler = useCallback(() => {
    setReplyEditId(null);
    // setReplyComment("");
  }, []);

  const Comments = memo(() => {
    return (
      <>
        {comments.map((comment, idx) => (
          <div key={idx}>
            <CommentBox comment={comment} />
            {comment.children &&
              comment.children.map((child, idx2) => (
                <CommentBox key={idx2 + 10000} comment={child} />
              ))}
          </div>
        ))}
      </>
    );
  });

  const CommentBox = ({ comment }) => {
    const [content, setContent] = useRecoilState(replyAtom);
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
          {replyEditId !== comment.id ? (
            <CommentView
              comment={comment}
              onEdit={toggleEditHandler}
              setContent={setContent}
            />
          ) : (
            <CommentEdit
              comment={comment}
              onCancel={cancelEditHandler}
              content={content}
              setContent={setContent}
            />
          )}
        </Timeline.Content>
      </Timeline.Item>
    );
  };

  const CommentView = memo(({ comment, onEdit, setContent }) => {
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
              <p>@{comment.parentName}</p>
              {comment.content}
            </div>
          ) : (
            <div className="comment-content-body">{comment.content}</div>
          )}
          <div className="comment-content-footer">
            <time dateTime={comment.createdAt}>
              {getDatetime(comment.createdAt)}
            </time>
            <button>답글</button>
          </div>
        </Timeline.Body>
      </>
    );
  });

  const CommentEdit = memo(({ comment, onCancel, content, setContent }) => {
    return (
      <>
        <CommentEditor
          content={content}
          setContent={setContent}
          onCancel={onCancel}
        />
      </>
    );
  });

  const [editorContent, setEditorContent] = useState("");

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
      <CommentEditor content={editorContent} setContent={setEditorContent} />
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
