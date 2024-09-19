package io.blog.devlog.domain.post.service;

import io.blog.devlog.domain.post.model.PostViews;
import io.blog.devlog.domain.post.model.PostViewsId;
import io.blog.devlog.domain.post.repository.PostRepository;
import io.blog.devlog.domain.post.repository.PostViewsRepository;
import io.blog.devlog.domain.user.model.User;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class PostViewsServiceImpl implements PostViewsService {
    private final Long perViewCount = 1000*60*60L; // 1 hour
    private final PostViewsRepository postViewsRepository;
    private final PostRepository postRepository;

    @Override
    public void increaseViewCount(Long postId, HttpServletRequest request) {
        String clientIP = request.getRemoteAddr();
        if (request.getHeader("X-Forwarded-For") != null) {
            clientIP = request.getHeader("X-Forwarded-For").split(",")[0];
        }

        PostViews postViews = postViewsRepository.findById(new PostViewsId(postId, clientIP)).orElse(null);
        Timestamp now = new Timestamp(System.currentTimeMillis());
        if (postViews != null && postViews.getViewsAt().getTime() + perViewCount > now.getTime()) {
            return;
        }
        if (postViews == null) {
            postViews = PostViews.builder()
                    .id(new PostViewsId(postId, clientIP))
                    .viewsAt(now)
                    .build();
        } else {
            postViews.setViewsAt(now);
        }
        postViewsRepository.save(postViews);
        postRepository.increasePostView(postId);
    }
}
