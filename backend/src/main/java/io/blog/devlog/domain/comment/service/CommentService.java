package io.blog.devlog.domain.comment.service;

import io.blog.devlog.domain.comment.dto.RequestCommentDto;
import io.blog.devlog.domain.comment.model.Comment;
import io.blog.devlog.domain.comment.repository.CommentRepository;
import io.blog.devlog.domain.post.model.Post;
import io.blog.devlog.domain.post.service.PostService;
import io.blog.devlog.domain.user.model.User;
import io.blog.devlog.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static io.blog.devlog.global.utils.SecurityUtils.getUserEmail;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class CommentService {
    private final CommentRepository commentRepository;
    private final UserService userService;
    private final PostService postService;

    public void saveComment(RequestCommentDto requestCommentDto) {
        commentRepository.save(requestCommentDto.toEntity());
    }

    public List<Comment> getCommentsFromPost(Post post) throws BadRequestException {
        String email = getUserEmail();
        Long userId = null;
        boolean isAdmin = false;
        if (email == null) {
            userId = 0L;
        } else {
            User user = userService.getUserByEmail(email).orElseThrow(() -> new BadRequestException("User not found : " + email));
            userId = user.getId();
            isAdmin = userService.isAdmin(user);
        }
        return commentRepository.findAllByPostId(post.getId(), userId, isAdmin);
    }

    public List<Comment> getCommentsByPostUrl(String postUrl) throws BadRequestException {
        Post post = postService.getPostByUrl(postUrl); // 여기서 카테고리 읽기 권한까지 확인함.
        return this.getCommentsFromPost(post);
    }
}
