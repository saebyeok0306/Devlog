import React, { useState } from "react";

import "./Comment.scss";
import { Timeline } from "flowbite-react";
import { timelineCustomTheme } from "styles/theme/timeline";
import CommentEditor from "components/editor/commentEditor";
import { useRecoilValue } from "recoil";
import { themeAtom } from "recoil/themeAtom";
import { authAtom } from "recoil/authAtom";
import { postAtom } from "recoil/postAtom";
import { commentAtom } from "recoil/commentAtom";
import Comments from "./comments/Comments";
import {
  isWriteComment,
  uploadCommentHandler,
} from "./comments/CommentsHandler";

function Comment({ ...props }) {
  const { commentRef, comments } = props;
  const authDto = useRecoilValue(authAtom);
  const isDark = useRecoilValue(themeAtom);
  const [reply, setReply] = useState({
    flag: false, // true: 답글 작성 false: 편집
    editId: null, // 편집 중인 댓글 id
    target: null, // 답글 대상
    content: "",
    private: false,
    files: [],
  });
  const postContent = useRecoilValue(postAtom);
  const commentState = useRecoilValue(commentAtom);
  console.log("commentState", commentState);

  const [editorComment, setEditorComment] = useState({
    content: "",
    files: [],
    private: false,
  });

  return (
    <div
      ref={commentRef}
      className="comment-container"
      data-color-mode={isDark ? "dark" : "light"}
    >
      <Timeline className="comments" theme={timelineCustomTheme}>
        <Comments comments={comments} reply={reply} setReply={setReply} />
      </Timeline>
      {/* Post Comment Editor */}
      {isWriteComment({ commentState: commentState, authDto: authDto }) ? (
        <CommentEditor
          content={editorComment.content}
          setContent={(text) =>
            setEditorComment({ ...editorComment, content: text })
          }
          files={editorComment.files}
          setFiles={(files) =>
            setEditorComment({ ...editorComment, files: files })
          }
          onSave={() =>
            uploadCommentHandler({
              postContent: postContent,
              comments: comments,
              editorComment: editorComment,
              setEditorComment: setEditorComment,
            })
          }
        />
      ) : null}
    </div>
  );
}

export default Comment;
