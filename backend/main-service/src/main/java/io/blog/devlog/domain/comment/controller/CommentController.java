package io.blog.devlog.domain.comment.controller;

import io.blog.devlog.domain.comment.dto.RequestCommentDto;
import io.blog.devlog.domain.comment.dto.RequestEditCommentDto;
import io.blog.devlog.domain.comment.dto.ResponseCommentDto;
import io.blog.devlog.domain.comment.model.Comment;
import io.blog.devlog.domain.comment.service.CommentService;
import io.blog.devlog.domain.post.model.PostDetail;
import io.blog.devlog.domain.post.service.PostService;
import io.blog.devlog.domain.user.model.User;
import io.blog.devlog.domain.user.service.UserService;
import io.blog.devlog.global.exception.NoPermissionException;
import io.blog.devlog.global.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

import static io.blog.devlog.global.utils.SecurityUtils.getUserEmail;

@RequiredArgsConstructor
@RestController
@RequestMapping("/comments")
@Slf4j
public class CommentController {
    private final UserService userService;
    private final PostService postService;
    private final CommentService commentService;
    @PostMapping
    public ResponseCommentDto uploadComment(@RequestBody RequestCommentDto requestCommentDto) {
        String email = getUserEmail();
        User user = userService.getUserByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found : " + email));

        PostDetail postDetail = postService.getPostByUrl(requestCommentDto.getPostUrl(), user);
        if (!postDetail.isCommentFlag()) {
            throw new NoPermissionException("댓글을 작성할 권한이 없습니다.");
        }
        return commentService.saveComment(user, requestCommentDto, postDetail.getPost());
    }

    @PostMapping("/{commentId}")
    public void updateComment(@RequestBody RequestEditCommentDto requestEditCommentDto, @PathVariable Long commentId) {
        Comment comment = commentService.updateComment(requestEditCommentDto, commentId);
        log.info("Update comment : " + comment);
    }

    @DeleteMapping("/{commentId}")
    public void deleteComment(@PathVariable Long commentId) throws IOException {
        commentService.deleteComment(commentId);
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<ResponseCommentDto>> getCommentsByPost(@PathVariable Long postId) {
        String email = getUserEmail();
        User user = userService.getUserByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found : " + email));
        return ResponseEntity.ok(commentService.getCommentsFromPost(user, postId));
    }
}
