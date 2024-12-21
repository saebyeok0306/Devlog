"use client";
import {
  get_post_edit_permission_api,
  get_post_files_api,
  get_post_url_api,
} from "@/api/posts";
import { PostContext, postContextAtom } from "@/recoil/editorAtom";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

const PostEditor = dynamic(() => import("@/components/editor/postEditor"), {
  ssr: false, // 서버사이드 렌더링 비활성화
});

function PostEditorContainer() {
  const navigate = useRouter();
  const { postUrl } = useParams();
  const [isReady, setIsReady] = useState(false);
  const [, setPostContext] = useRecoilState(postContextAtom);

  useEffect(() => {
    const getPost = async () => {
      try {
        const isEdit = await get_post_edit_permission_api(postUrl);
        if (!isEdit) {
          navigate.push("/");
          return;
        }

        const post = await get_post_url_api(postUrl);
        const postData = post?.post;

        const files = await get_post_files_api(postData.id);
        postData["files"] = files || [];

        const preview = postData.files.find(
          (file) =>
            `${process.env.NEXT_PUBLIC_API_FILE_URL}/${file.filePath}/${file.fileUrl}` ===
            postData.previewUrl
        );

        const newContext = new PostContext(
          postData.id,
          postData.title,
          "", // body
          postData.content,
          postData.category,
          postData.files,
          preview,
          postData.private,
          postData.createdAt,
          postData.modifiedAt,
          postData.url,
          postData.views
        );

        setPostContext(newContext);
        setIsReady(true);
      } catch (err) {
        console.error("Failed to get post:", err);
        if (history.length > 1) {
          navigate.back();
        } else {
          navigate.push("/");
        }
      }
    };
    getPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isReady) {
    return <></>;
  }

  return (
    <>
      <PostEditor />
    </>
  );
}

export default PostEditorContainer;
