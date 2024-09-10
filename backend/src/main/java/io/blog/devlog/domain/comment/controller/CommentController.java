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
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

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
    public ResponseCommentDto uploadComment(@RequestBody RequestCommentDto requestCommentDto) throws BadRequestException {
        String email = getUserEmail();
        User user = userService.getUserByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found : " + email));

        PostDetail postDetail = postService.getPostByUrl(requestCommentDto.getPostUrl(), user);
        if (!postDetail.isCommentFlag()) {
            throw new BadRequestException("You don't have permission to write a comment.");
        }
        return commentService.saveComment(user, requestCommentDto, postDetail.getPost());
    }

    @PostMapping("/{commentId}")
    public void updateComment(@RequestBody RequestEditCommentDto requestEditCommentDto, @PathVariable Long commentId) throws BadRequestException {
        Comment comment = commentService.updateComment(requestEditCommentDto, commentId);
        log.info("Update comment : " + comment);
    }

    @DeleteMapping("/{commentId}")
    public void deleteComment(@PathVariable Long commentId) throws IOException {
        commentService.deleteComment(commentId);
    }
}
