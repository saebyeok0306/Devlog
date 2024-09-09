package io.blog.devlog.domain.comment.service;

import io.blog.devlog.domain.comment.dto.RequestCommentDto;
import io.blog.devlog.domain.comment.dto.RequestEditCommentDto;
import io.blog.devlog.domain.comment.dto.ResponseCommentDto;
import io.blog.devlog.domain.comment.model.Comment;
import io.blog.devlog.domain.comment.repository.CommentRepository;
import io.blog.devlog.domain.file.service.FileService;
import io.blog.devlog.domain.post.model.Post;
import io.blog.devlog.domain.post.model.PostCommentFlag;
import io.blog.devlog.domain.post.service.PostService;
import io.blog.devlog.domain.user.model.User;
import io.blog.devlog.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;

import static io.blog.devlog.global.utils.SecurityUtils.getUserEmail;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class CommentService {
    private final CommentRepository commentRepository;
    private final UserService userService;
    private final FileService fileService;

    public ResponseCommentDto saveComment(User user, RequestCommentDto requestCommentDto, Post post) {
        Comment comment = commentRepository.save(requestCommentDto.toEntity(user, post));
        fileService.uploadFileAndDeleteTempFile(comment, requestCommentDto.getFiles());
        return ResponseCommentDto.of(user.getEmail(), comment);
    }

    public Comment updateComment(RequestEditCommentDto requestEditCommentDto, Long commentId) throws BadRequestException {
        Comment comment = commentRepository.findById(commentId).orElseThrow(() -> new BadRequestException("Comment not found : " + commentId));
        String email = getUserEmail();
        if (!comment.getUser().getEmail().equals(email)) {
            throw new BadRequestException("You don't have permission to edit this comment.");
        }
        comment = commentRepository.save(comment.toEdit(requestEditCommentDto));
        fileService.uploadFileAndDeleteTempFile(comment, requestEditCommentDto.getFiles());
        return comment;
    }

    public List<ResponseCommentDto> getCommentsFromPost(User user, PostCommentFlag postCommentFlag) throws BadRequestException {
        Long userId = user.getId() == null ? 0L : user.getId();
        boolean isAdmin = userService.isAdmin(user);
        List<Comment> comments = commentRepository.findAllByPostId(postCommentFlag.getPost().getId(), userId, isAdmin);
        return comments.stream()
                .map(comment -> ResponseCommentDto.of(user.getEmail(), comment))
                .toList();
    }

    public void deleteComment(Long commentId) throws IOException {
        Comment comment = commentRepository.findById(commentId).orElseThrow(() -> new BadRequestException("Comment not found : " + commentId));
        String email = getUserEmail();
        if (!comment.getUser().getEmail().equals(email)) {
            throw new BadRequestException("You don't have permission to delete this comment.");
        }
        comment.setDeleted(true);
        fileService.deleteFileFromComment(comment);
        commentRepository.save(comment);
    }

    public void deleteCommentsByPostId(Long postId) {
        List<Comment> comments = commentRepository.findAllByPostId(postId, 0L, true);
        comments.forEach(comment -> {
            fileService.deleteFileFromComment(comment);
            commentRepository.delete(comment);
        });
    }
}
