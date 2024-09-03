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
    private final PostService postService;
    private final FileService fileService;

    public ResponseCommentDto saveComment(RequestCommentDto requestCommentDto) throws BadRequestException {
        String email = getUserEmail();
        User user = userService.getUserByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found : " + email));

        PostCommentFlag postCommentFlag = postService.getPostByUrl(requestCommentDto.getPostUrl(), user);
        System.out.println(postCommentFlag);
        if (!postCommentFlag.isCommentFlag()) {
            throw new BadRequestException("You don't have permission to write a comment.");
        }

        Comment comment = commentRepository.save(requestCommentDto.toEntity(user, postCommentFlag.getPost()));
        fileService.uploadFileAndDeleteTempFile(comment, requestCommentDto.getFiles());
        return ResponseCommentDto.of(comment);
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

    public List<ResponseCommentDto> getCommentsFromPost(PostCommentFlag postCommentFlag) throws BadRequestException {
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
        List<Comment> comments = commentRepository.findAllByPostId(postCommentFlag.getPost().getId(), userId, isAdmin);
        return comments.stream()
                .map(ResponseCommentDto::of)
                .toList();
    }

    public List<ResponseCommentDto> getCommentsByPostUrl(String postUrl) throws BadRequestException {
        PostCommentFlag postCommentFlag = postService.getPostByUrl(postUrl); // 여기서 카테고리 읽기 권한까지 확인함.
        return this.getCommentsFromPost(postCommentFlag);
    }

    public void deleteComment(Long commentId) throws IOException {
        Comment comment = commentRepository.findById(commentId).orElseThrow(() -> new BadRequestException("Comment not found : " + commentId));
        String email = getUserEmail();
        if (!comment.getUser().getEmail().equals(email)) {
            throw new BadRequestException("You don't have permission to delete this comment.");
        }
        comment.setDeleted(true);
        boolean isDeleted = fileService.deleteFileFromComment(comment);
        if (!isDeleted) {
            throw new BadRequestException("잘못된 파일 경로이거나 파일 이름입니다.");
        }
        commentRepository.save(comment);
    }
}
