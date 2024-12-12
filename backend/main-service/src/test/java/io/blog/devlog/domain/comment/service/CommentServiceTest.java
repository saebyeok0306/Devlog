package io.blog.devlog.domain.comment.service;

import io.blog.devlog.config.TestConfig;
import io.blog.devlog.domain.comment.dto.RequestCommentDto;
import io.blog.devlog.domain.comment.dto.RequestEditCommentDto;
import io.blog.devlog.domain.comment.dto.ResponseCommentDto;
import io.blog.devlog.domain.comment.model.Comment;
import io.blog.devlog.domain.comment.repository.CommentRepository;
import io.blog.devlog.domain.file.service.FileService;
import io.blog.devlog.domain.post.model.Post;
import io.blog.devlog.domain.post.model.PostDetail;
import io.blog.devlog.domain.user.model.Role;
import io.blog.devlog.domain.user.model.User;
import io.blog.devlog.utils.EntityFactory;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doNothing;

@ActiveProfiles("test")
@ExtendWith(MockitoExtension.class)
public class CommentServiceTest {
    @Mock
    private CommentRepository commentRepository;
    @Mock
    private FileService fileService;
    @InjectMocks
    private CommentService commentService;
    private static final TestConfig testConfig = new TestConfig();


    @Test
    void saveComment() {
        // given
        Post post = EntityFactory.createPost();
        RequestCommentDto commentDto = RequestCommentDto.builder()
                .parent(1L)
                .build();
        Comment comment = commentDto.toEntity(testConfig.adminUser, post);

        given(commentRepository.save(any(Comment.class))).willReturn(comment);
        doNothing().when(fileService).uploadFileAndDeleteTempFile(comment, commentDto.getFiles());
        doNothing().when(fileService).deleteTempFiles();

        // when
        ResponseCommentDto responseCommentDto = commentService.saveComment(testConfig.adminUser, commentDto, post);

        // then
        assertThat(responseCommentDto.getUser().getUsername()).isEqualTo(testConfig.adminUser.getUsername());
        assertThat(responseCommentDto.getParent()).isEqualTo(1L);
    }

    @Test
    void updateComment() {
        // given
        Long commentId = null;
        User user = EntityFactory.createUser(null, null, Role.ADMIN);
        Post post = EntityFactory.createPost();
        Comment comment = EntityFactory.createComment("prev content", user, post);
        RequestEditCommentDto editCommentDto = RequestEditCommentDto.builder()
                .content("edit content")
                .isPrivate(false)
                .build();
        Comment editedComment = comment.toEdit(editCommentDto);
        given(commentRepository.findById(commentId)).willReturn(Optional.of(comment));
        given(commentRepository.save(any(Comment.class))).willReturn(editedComment);
        doNothing().when(fileService).uploadFileAndDeleteTempFile(editedComment, editCommentDto.getFiles());
        doNothing().when(fileService).deleteTempFiles();
        doNothing().when(fileService).deleteUnusedFilesByComment(editedComment, editCommentDto.getFiles());
        testConfig.updateAuthentication(user);

        // when
        Comment resultComment = commentService.updateComment(editCommentDto, commentId);

        // then
        assertThat(resultComment.getContent()).isEqualTo("edit content");
    }

    @Test
    void getCommentsFromPost() {
        // given
        User user = EntityFactory.createUser();
        Post post = EntityFactory.createPost();
        List<Comment> comments = List.of(EntityFactory.createComment("test", user, post));
        PostDetail postDetail = PostDetail.builder()
                .post(post)
                .commentFlag(true)
                .build();
        given(commentRepository.findAllByPostId(null, 0L, false)).willReturn(comments);

        // when
        List<ResponseCommentDto> commentsFromPost = commentService.getCommentsFromPost(user, postDetail);

        // then
        assertThat(commentsFromPost.size()).isEqualTo(1);
        assertThat(commentsFromPost.get(0).getUser().getEmail()).isEqualTo(user.getEmail());
        assertThat(commentsFromPost.get(0).getContent()).isEqualTo("test");
    }

    @Test
    void deleteComment() {
        // given
        Long commentId = null;
        User user = EntityFactory.createUser(null, null, Role.ADMIN);
        Post post = EntityFactory.createPost();
        Comment comment = EntityFactory.createComment("test", user, post);
        given(commentRepository.findById(commentId)).willReturn(Optional.ofNullable(comment));
        given(commentRepository.save(comment)).willReturn(comment);
        doNothing().when(fileService).deleteFileFromComment(comment);
        testConfig.updateAuthentication(user);

        // when
        commentService.deleteComment(commentId);

        // then
        assertThat(comment.isDeleted()).isTrue();
    }

    @Test
    void deleteCommentsByPostId() {
    }
}
