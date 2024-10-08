package io.blog.devlog.domain.post.service;

import io.blog.devlog.domain.user.model.User;
import jakarta.servlet.http.HttpServletRequest;

public interface PostViewsService {
    public void increaseViewCount(Long postId, HttpServletRequest request);
}
