package io.blog.devlog.domain.post.service;

import io.blog.devlog.domain.file.service.FileService;
import io.blog.devlog.domain.post.model.Post;
import io.blog.devlog.domain.post.model.PostDetail;
import io.blog.devlog.domain.post.repository.PostRepository;
import io.blog.devlog.domain.user.model.Role;
import io.blog.devlog.domain.user.model.User;
import io.blog.devlog.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static io.blog.devlog.global.utils.SecurityUtils.getUserEmail;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class PostService {
    private final PostRepository postRepository;
    private final UserService userService;
    private final FileService fileService;

    public Post getPostById(Long id) {
        return postRepository.findById(id).orElse(null);
    }

    public Post getSimplePostByUrl(String url) {
        return postRepository.findByUrl(url).orElse(null);
    }

    public PostDetail getPostByUrl(String url) throws BadRequestException {
        String email = getUserEmail();
        return this.getPostByUrl(email, url);
    }

    public PostDetail getPostByUrl(String email, String url) throws BadRequestException {
        User user = userService.getUserByEmail(email).orElse(null);
        if (user == null) {
            return this.getPostByUrl(url, 0L, false, Role.GUEST);
        }
        return this.getPostByUrl(url, user);
    }

    public PostDetail getPostByUrl(String url, User user) throws BadRequestException {
        return this.getPostByUrl(url, user.getId() == null ? 0L : user.getId(), userService.isAdmin(user), user.getRole());
    }

    public PostDetail getPostByUrl(String url, Long userId, boolean isAdmin, Role role) throws BadRequestException {
        Post post = postRepository.findPostByUrl(url, userId, isAdmin, role).orElseThrow(() -> new BadRequestException("Post not found : " + url));
        return PostDetail.builder()
                .post(post)
                .commentFlag(post.getCategory().getWriteCommentAuth().getKey() <= role.getKey())
                .build();
    }

    public Page<Post> getPosts(Pageable pageable) throws BadRequestException {
        String email = getUserEmail();
        log.info("getPosts (email: " + email + ")");
        if (email == null) {
            return postRepository.findAllPublicPosts(pageable, Role.GUEST);
        }
        User user = userService.getUserByEmail(email).orElseThrow(() -> new BadRequestException("User not found : " + email));
        return postRepository.findAllUserPosts(pageable, user.getId(), userService.isAdmin(user), user.getRole());
    }

    public Page<Post> getPostsByCategory(String categoryName, Pageable pageable) throws BadRequestException {
        String email = getUserEmail();
        if (email == null) {
            return postRepository.findAllByCategory(pageable, categoryName, 0L, false, Role.GUEST);
        }
        User user = userService.getUserByEmail(email).orElseThrow(() -> new BadRequestException("User not found : " + email));
        return postRepository.findAllByCategory(pageable, categoryName, user.getId(), userService.isAdmin(user), user.getRole());
    }

    public Page<Post> getPostsByCategoryId(Long categoryId, Pageable pageable) throws BadRequestException {
        String email = getUserEmail();
        if (email == null) {
            return postRepository.findAllByCategoryId(pageable, categoryId, 0L, false, Role.GUEST);
        }
        User user = userService.getUserByEmail(email).orElseThrow(() -> new BadRequestException("User not found : " + email));
        return postRepository.findAllByCategoryId(pageable, categoryId, user.getId(), userService.isAdmin(user), user.getRole());
    }

    public void deletePost(Post post) throws BadRequestException {
        fileService.deleteFileFromPost(post);
        postRepository.delete(post);
    }
}
