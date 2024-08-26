package io.blog.devlog.domain.comment.controller;

import io.blog.devlog.domain.comment.dto.RequestCommentDto;
import io.blog.devlog.domain.comment.dto.RequestEditCommentDto;
import io.blog.devlog.domain.comment.dto.ResponseCommentDto;
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
    public ResponseCommentDto uploadComment(@RequestBody RequestCommentDto requestCommentDto) throws BadRequestException {
        return commentService.saveComment(requestCommentDto);
    }

    @PostMapping("/{commentId}")
    public void updateComment(@RequestBody RequestEditCommentDto requestEditCommentDto, @PathVariable Long commentId) throws BadRequestException {
        Comment comment = commentService.updateComment(requestEditCommentDto, commentId);
        log.info("Update comment : " + comment);
    }

    @GetMapping("/post/{postUrl}")
    public List<ResponseCommentDto> getComments(@PathVariable String postUrl) throws BadRequestException {
        log.info("Get comments of post : " + postUrl);
        return commentService.getCommentsByPostUrl(postUrl);
    }
}
