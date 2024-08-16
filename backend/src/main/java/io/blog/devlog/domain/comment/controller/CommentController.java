package io.blog.devlog.domain.comment.controller;

import io.blog.devlog.domain.comment.dto.RequestCommentDto;
import io.blog.devlog.domain.comment.model.Comment;
import io.blog.devlog.domain.comment.service.CommentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/comments")
@Slf4j
public class CommentController {
    private final CommentService commentService;
    @PostMapping
    public void uploadComment(@RequestBody RequestCommentDto requestCommentDto) {
        commentService.saveComment(requestCommentDto);

    }

    @GetMapping("/post/{postUrl}")
    public List<Comment> getComments(@PathVariable String postUrl) throws BadRequestException {
        log.info("Get comments of post : " + postUrl);
        return commentService.getCommentsByPostUrl(postUrl);
    }
}
