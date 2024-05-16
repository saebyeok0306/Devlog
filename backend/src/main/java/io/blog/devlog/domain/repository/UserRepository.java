package io.blog.devlog.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import io.blog.devlog.domain.model.User;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

// CRUD 함수를 JpaRepository가 들고 있음.
// @Repository를 하지 않아도, JpaRepository에 있고 그걸 상속했기 때문에 괜찮음.
public interface UserRepository extends JpaRepository<User, Integer> {
    // findBy 규칙 -> select * from user where username = 1?
    public Optional<User> findByUsername(String username); // JPA Query Methods
    public Optional<User> findByEmail(String email);
    public Optional<User> findByRefreshToken(String refreshToken);
    @Modifying
    @Query("UPDATE User u SET u.refreshToken = :token WHERE u.username = :username")
    public void updateRefreshTokenByUsername(String username, String token);
}
