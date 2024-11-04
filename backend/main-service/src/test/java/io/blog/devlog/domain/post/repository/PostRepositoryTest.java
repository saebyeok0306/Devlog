package io.blog.devlog.domain.post.repository;

import io.blog.devlog.domain.post.model.Post;
import io.blog.devlog.domain.user.model.Role;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DataJpaTest
@ActiveProfiles("test")
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
@Sql(value="/sql/test/post/post.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_CLASS)
public class PostRepositoryTest {
    @Autowired
    private PostRepository postRepository;

    @Test
    void findByUrl() {
        // given

        // when
        Optional<Post> post = postRepository.findByUrl("url1");

        // then
        assertTrue(post.isPresent());
    }

    @Test
    void findPostByUrl() {
        // given

        // when
        Optional<Post> post = postRepository.findPostByUrl("url1", 1L, true, Role.ADMIN);

        // then
        assertTrue(post.isPresent());
    }

    @Test
    void findPostByUrl2() {
        // given

        // when
        Optional<Post> post = postRepository.findPostByUrl("url2", 2L, false, Role.USER);

        // then
        assertTrue(post.isEmpty());
    }

    @Test
    void findAllPageUserPosts() {
        // given
        PageRequest pageRequest = PageRequest.of(0, 5);

        // when
        Page<Post> allPageUserPosts = postRepository.findAllPageUserPosts(pageRequest, 1L, true, Role.ADMIN);

        // then
        assertThat(allPageUserPosts.getContent().size()).isEqualTo(5);
        assertThat(allPageUserPosts.getTotalElements()).isEqualTo(20);
    }

    @Test
    void findAllPagePublicPosts() {
        // given
        PageRequest pageRequest = PageRequest.of(0, 5);

        // when
        Page<Post> allPagePublicPosts = postRepository.findAllPagePublicPosts(pageRequest, Role.GUEST);

        // then
        assertThat(allPagePublicPosts.getContent().size()).isEqualTo(5);
        assertThat(allPagePublicPosts.getTotalElements()).isEqualTo(17);
    }

    @Test
    void findAllPageByCategory() {
        // given
        PageRequest pageRequest = PageRequest.of(0, 5);

        // when
        Page<Post> getPost = postRepository.findAllPageByCategory(pageRequest, "category2", 1L, true, Role.ADMIN);

        // then
        assertThat(getPost.getContent().size()).isEqualTo(1);
        assertThat(getPost.getTotalElements()).isEqualTo(1);
    }

    @Test
    void findAllPageByCategoryId() {
        // given
        PageRequest pageRequest = PageRequest.of(0, 5);

        // when
        Page<Post> getPost = postRepository.findAllPageByCategoryId(pageRequest, 2L, 1L, true, Role.ADMIN);

        // then
        assertThat(getPost.getContent().size()).isEqualTo(1);
        assertThat(getPost.getTotalElements()).isEqualTo(1);
    }

    @Test
    void findAllByCategoryId() {
        // given

        // when
        List<Post> allByCategoryId = postRepository.findAllByCategoryId(1L);

        // then
        assertThat(allByCategoryId.size()).isEqualTo(19);
    }

    @Test
    void increasePostView() {
        // given

        // when
        postRepository.increasePostView(1L);

        // then
        assertThat(postRepository.findById(1L).get().getViews()).isEqualTo(1);
    }
}