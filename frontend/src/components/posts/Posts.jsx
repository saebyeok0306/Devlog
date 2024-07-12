import React, { useState } from "react";

import "./Posts.scss";
import { onErrorImg } from "utils/defaultImg";

class Post {
  constructor(title) {
    this.title = title;
    this.author = "dev";
    this.category = "카테고리";
    this.createAt = "2024년 06월 03일";
    this.content = "콘텐츠콘텐츠콘텐츠콘텐츠콘텐츠콘텐츠";
  }
}

const post_list = [
  new Post("게시글1"),
  new Post("게시글2"),
  new Post("게시글3"),
  new Post("게시글4"),
  new Post("게시글5"),
  new Post("게시글6"),
  new Post("게시글7"),
];

function PostCard(idx, post) {
  return (
    <div className="post" key={idx}>
      <img className="post-img" src="" alt="post" onError={onErrorImg} />
      <div className="post-title">{post.title}</div>
      <div className="post-bottom">
        <div className="post-category">{post.category}</div>
        <div className="post-create">{post.createAt}</div>
      </div>
      {/* <div className="author">by {post.author}</div> */}
      {/* <div className="content">{post.content}</div> */}
    </div>
  );
}

function Posts() {
  const [posts, setPosts] = useState(post_list);
  return (
    <>
      <h1 className="post-count">{posts.length} posts</h1>
      <div className="posts">{posts.map((val, idx) => PostCard(idx, val))}</div>
    </>
  );
}

export default Posts;
