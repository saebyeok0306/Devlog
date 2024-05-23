import React from "react";

import "./Posts.scss";

class Post {
  constructor (title) {
    this.title = title;
    this.author = "dev";
    this.content = "콘텐츠콘텐츠콘텐츠콘텐츠콘텐츠콘텐츠";
  }
}

const post_list = [
  new Post("게시글1"),new Post("게시글2"),new Post("게시글3"),new Post("게시글4"),new Post("게시글5"),new Post("게시글6"),new Post("게시글7")
];

function PostCard(idx, post) {
  return (
    <div className="post" key={idx}>
      <div className="title">{post.title}</div>
      <div className="author">{post.author}</div>
      <div className="content">{post.content}</div>
    </div>
  );
}

function Posts() {
  return (
    <div className="posts">
     {post_list.map((val, idx) => (PostCard(idx, val)))}
    </div>
  );
}

export default Posts;