import React, { useContext } from "react";

import "./CommentEditor.scss";
import RehypeVideo from "rehype-video";
import MDEditor, { commands, EditorContext } from "@uiw/react-md-editor";

const Button = () => {
  const { preview, dispatch } = useContext(EditorContext);
  const click = () => {
    dispatch({
      preview: preview === "edit" ? "preview" : "edit",
    });
  };
  if (preview === "edit") {
    return (
      <button onClick={click}>
        <svg width="12" height="12" viewBox="0 0 520 520">
          <polygon
            fill="currentColor"
            points="0 71.293 0 122 319 122 319 397 0 397 0 449.707 372 449.413 372 71.293"
          />
          <polygon
            fill="currentColor"
            points="429 71.293 520 71.293 520 122 481 123 481 396 520 396 520 449.707 429 449.413"
          />
        </svg>
      </button>
    );
  }
  return (
    <button onClick={click}>
      <svg width="12" height="12" viewBox="0 0 520 520">
        <polygon
          fill="currentColor"
          points="0 71.293 0 122 38.023 123 38.023 398 0 397 0 449.707 91.023 450.413 91.023 72.293"
        />
        <polygon
          fill="currentColor"
          points="148.023 72.293 520 71.293 520 122 200.023 124 200.023 397 520 396 520 449.707 148.023 450.413"
        />
      </svg>
    </button>
  );
};

const codePreview = {
  name: "preview",
  keyCommand: "preview",
  value: "preview",
  icon: <Button />,
};

function CommentEditor() {
  const [content, setContent] = React.useState("");
  return (
    <div className="comment-editor">
      <MDEditor
        // ref={editorRef}
        preview="edit"
        style={{ flex: "1", whiteSpace: "pre-wrap" }}
        value={content}
        onChange={setContent}
        // onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        // onPaste={handlePaste}
        height={"100%"}
        textareaProps={{
          placeholder: "댓글을 입력하세요.",
        }}
        previewOptions={{
          rehypePlugins: [[RehypeVideo, { test: /\/(.*)(.mp4|.mov)$/ }]],
        }}
        commands={[
          commands.bold,
          commands.italic,
          commands.strikethrough,
          commands.hr,
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
          // commands.group([], fileUploader),
        ]}
        extraCommands={[codePreview]}
      />
    </div>
  );
}

export default CommentEditor;
