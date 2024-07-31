package io.blog.devlog.domain.post.repository;

import io.blog.devlog.domain.category.model.Category;
import io.blog.devlog.domain.post.model.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    @EntityGraph(attributePaths = {"user", "category"}, type = EntityGraph.EntityGraphType.FETCH)
    @Query("SELECT p FROM Post p LEFT JOIN p.user LEFT JOIN p.category WHERE p.url = :url")
    public Optional<Post> findByUrl(String url);
    @EntityGraph(attributePaths = {"user", "category"}, type = EntityGraph.EntityGraphType.FETCH)
    @Query("SELECT p FROM Post p LEFT JOIN p.user LEFT JOIN p.category WHERE p.isPrivate = false OR :isAdmin = true OR p.user.id = :userId")
    Page<Post> findAllUserPosts(@Param("userId") Long userId, @Param("isAdmin") boolean isAdmin, Pageable pageable);
    @EntityGraph(attributePaths = {"user", "category"}, type = EntityGraph.EntityGraphType.FETCH)
    @Query("SELECT p FROM Post p LEFT JOIN p.user LEFT JOIN p.category WHERE p.isPrivate = false")
    Page<Post> findAllPublicPosts(Pageable pageable);
    @EntityGraph(attributePaths = {"user", "category"}, type = EntityGraph.EntityGraphType.FETCH)
    @Query("SELECT p FROM Post p LEFT JOIN p.user LEFT JOIN p.category WHERE p.category.name = :categoryName AND (p.isPrivate = false OR :isAdmin = true OR p.user.id = :userId)")
    Page<Post> findAllByCategory(@Param("categoryName") String categoryName, @Param("userId") Long userId, @Param("isAdmin") boolean isAdmin, Pageable pageable);
    @EntityGraph(attributePaths = {"user", "category"}, type = EntityGraph.EntityGraphType.FETCH)
    @Query("SELECT p FROM Post p LEFT JOIN p.user LEFT JOIN p.category WHERE p.category.id = :categoryId AND (p.isPrivate = false OR :isAdmin = true OR p.user.id = :userId)")
    Page<Post> findAllByCategoryId(@Param("categoryId") Long categoryId, @Param("userId") Long userId, @Param("isAdmin") boolean isAdmin, Pageable pageable);
}
