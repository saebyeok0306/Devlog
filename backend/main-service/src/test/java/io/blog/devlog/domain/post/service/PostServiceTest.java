package io.blog.devlog.domain.post.service;

import io.blog.devlog.config.TestConfig;
import io.blog.devlog.domain.category.model.Category;
import io.blog.devlog.domain.file.service.FileService;
import io.blog.devlog.domain.post.model.Post;
import io.blog.devlog.domain.post.model.PostDetail;
import io.blog.devlog.domain.post.repository.PostRepository;
import io.blog.devlog.domain.user.model.Role;
import io.blog.devlog.domain.user.model.User;
import io.blog.devlog.domain.user.service.UserService;
import org.apache.coyote.BadRequestException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;


@ActiveProfiles("test")
@ExtendWith(MockitoExtension.class)
public class PostServiceTest {

    @Mock
    private PostRepository postRepository;
    @Mock
    private UserService userService;
    @Mock
    private FileService fileService;
    @InjectMocks
    private PostService postService;
    private static final TestConfig testConfig = new TestConfig();


    @Test
    @DisplayName("게시글 ID 기반 조회 테스트")
    void getPostById() {
        // given
        Post post = Post.builder().build();
        given(postRepository.findById(1L)).willReturn(Optional.ofNullable(post));

        // when
        Post postById = postService.getPostById(1L);

        // then
        assertThat(postById).isEqualTo(post);
    }

    @Test
    @DisplayName("게시글 URL 기반 조회 테스트")
    void getSimplePostByUrl() {
        // given
        Post post = Post.builder().build();
        given(postRepository.findByUrl("url")).willReturn(Optional.ofNullable(post));

        // when
        Post postByUrl = postService.getSimplePostByUrl("url");

        // then
        assertThat(postByUrl).isEqualTo(post);
    }

    @Test
    @DisplayName("게시글 URL 기반 유저 조회 테스트")
    void getPostByUrl() throws BadRequestException {
        // given
        testConfig.updateAuthentication(testConfig.adminUser);
        Category category = Category.builder().writeCommentAuth(Role.ADMIN).build();
        Post post = Post.builder().category(category).build();
        given(userService.getUserByEmail(testConfig.adminUser.getEmail())).willReturn(Optional.ofNullable(testConfig.adminUser));
        given(userService.isAdmin(testConfig.adminUser)).willReturn(true);
        given(postRepository.findPostByUrl("url", 0L, true, testConfig.adminUser.getRole())).willReturn(Optional.ofNullable(post));

        // when
        PostDetail postByUrl = postService.getPostByUrl("url");

        // then
        assertThat(postByUrl.getPost()).isEqualTo(post);
        testConfig.clearAuthentication();
    }

    @Test
    @DisplayName("GUEST 모든 게시글 조회 테스트")
    void getPosts() throws BadRequestException {
        // given
        PageRequest pageRequest = PageRequest.of(0, 10);
        Post post = Post.builder().build();
        Page<Post> posts = new PageImpl<>(List.of(post));

        given(postRepository.findAllPagePublicPosts(pageRequest, Role.GUEST)).willReturn(posts);

        // when
        Page<Post> getPosts = postService.getPosts(pageRequest);

        // then
        assertThat(getPosts).isEqualTo(posts);
    }

    @Test
    @DisplayName("GUEST가 아닌 유저의 모든 게시글 조회 테스트")
    void getPosts2() throws BadRequestException {
        // given
        testConfig.updateAuthentication(testConfig.adminUser);
        PageRequest pageRequest = PageRequest.of(0, 10);
        Post post = Post.builder().build();
        Page<Post> posts = new PageImpl<>(List.of(post));

        given(userService.getUserByEmail(testConfig.adminUser.getEmail())).willReturn(Optional.ofNullable(testConfig.adminUser));
        given(userService.isAdmin(testConfig.adminUser)).willReturn(true);
        given(postRepository.findAllPageUserPosts(pageRequest, null, true, Role.ADMIN)).willReturn(posts);

        // when
        Page<Post> getPosts = postService.getPosts(pageRequest);

        // then
        assertThat(getPosts).isEqualTo(posts);
        testConfig.clearAuthentication();
    }

    @Test
    void getPostsByCategory() {
        // given

        // when

        // then
    }

    @Test
    void getPostsByCategoryId() {
        // given

        // when

        // then
    }

    @Test
    void getAllPostsByCategoryId() {
        // given

        // when

        // then
    }

    @Test
    void deletePost() {
        // given

        // when

        // then
    }
}
