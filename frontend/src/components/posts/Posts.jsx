import React, { useEffect, useState } from "react";

import "./Posts.scss";
import { onErrorImg } from "utils/defaultImg";
import { get_category_posts_api, get_posts_api } from "api/Posts";
import { useRecoilState } from "recoil";
import { categoryAtom } from "recoil/categoryAtom";

function PostCard(idx, post, setSelectCategory) {
  const today = new Date();
  const createdAt = new Date(post.createdAt);
  const diff = (today - createdAt) / (1000 * 60 * 60);
  var post_time;
  if (diff >= 24) {
    post_time = `${createdAt.getFullYear()}.${createdAt.getMonth() + 1}.${createdAt.getDate()}.`;
  } else if (diff < 1) {
    post_time = `${Math.floor(diff * 60)}분 전`;
  } else {
    post_time = `${Math.floor(diff)}시간 전`;
  }
  return (
    <div className="post" key={idx}>
      <img
        className="post-img"
        src={post.previewUrl}
        alt="post"
        onError={onErrorImg}
      />
      <div className="post-title">{post.title}</div>
      <div className="post-bottom">
        <button
          className="post-category"
          onClick={() => setSelectCategory(post.category.name)}
        >
          {post.category.name}
        </button>
        <div className="post-create">{post_time}</div>
      </div>
      {/* <div className="author">by {post.author}</div> */}
      {/* <div className="content">{post.content}</div> */}
    </div>
  );
}

function Posts() {
  const [selectCategory, setSelectCategory] = useRecoilState(categoryAtom);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    get_posts_api(selectCategory)
      .then((response) => {
        console.log(response.data);
        setPosts(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [selectCategory]);

  return (
    <>
      <h1 className="post-count">{posts.length} posts</h1>
      <div className="posts">
        {posts.map((val, idx) => PostCard(idx, val, setSelectCategory))}
      </div>
    </>
  );
}

export default Posts;
