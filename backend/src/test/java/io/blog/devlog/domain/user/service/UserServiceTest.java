package io.blog.devlog.domain.user.service;

import io.blog.devlog.config.TestConfig;
import io.blog.devlog.domain.user.model.Role;
import io.blog.devlog.domain.user.model.User;
import io.blog.devlog.domain.user.repository.UserRepository;
import io.blog.devlog.global.jwt.service.JwtService;
import io.jsonwebtoken.Claims;
import org.apache.coyote.BadRequestException;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.test.context.ActiveProfiles;

@DataJpaTest
@ActiveProfiles("test")
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class UserServiceTest {
    @Autowired
    private UserRepository userRepository;
    private JwtService jwtService;
    private UserService userService;
    private String email = "westreed@naver.com";
    private String password = "password";
    private String username = "westreed";
    private User user = User.builder()
            .email(email)
            .password(password)
            .username(username)
            .role(Role.ADMIN)
            .build();

    @BeforeEach
    public void beforeSetUp() {
        jwtService = new TestConfig().createJwtService();
        userService = new UserService(userRepository, jwtService);
    }

    @Test
    @DisplayName("회원 추가")
    public void addUserTest() {
        // given
        userService.saveUser(user);

        // when
        User user = userRepository.findByEmail(email).orElse(null);

        // then
        Assertions.assertThat(user).isNotNull();
        Assertions.assertThat(user.getEmail()).isEqualTo(email);
    }
    
    @Test
    @DisplayName("RefreshToken 갱신")
    public void updateRefreshTokenTest() {
        // given
        String token = "imToken";
        User refresh_user = User.builder()
                .email(email)
                .password(password)
                .username(username)
                .build();
        refresh_user.updateRefreshToken("123");
        userService.saveUser(refresh_user);

        // when
        refresh_user.updateRefreshToken(token); // dirty checking

        // then
        User user = userRepository.findByEmail(email).orElse(null);
        Assertions.assertThat(user).isNotNull();
        Assertions.assertThat(user.getRefreshToken()).isEqualTo(token);
    }

    @Test
    @DisplayName("Reissue Token 검증")
    public void reissueAccessTokenTest() throws BadRequestException {
        // given
        User testUser = userService.saveUser(user);
        String refreshToken = jwtService.createRefreshToken(testUser);
        testUser.updateRefreshToken(refreshToken);

        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setMethod("GET");
        request.setRequestURI("/reissue");
        request.addHeader("Authorization", "Bearer " + refreshToken);


        // when
        String accessToken = userService.reissueAccessToken(request);

        // then
        Assertions.assertThat(accessToken).isNotNull();
        Assertions.assertThat(jwtService.isTokenValid(accessToken)).isTrue();
        Claims claims = jwtService.extractClaims(accessToken);
        Assertions.assertThat(claims.get("email")).isEqualTo(email);
    }

    @Test
    @DisplayName("ADMIN 계정 가져오기 검증")
    public void getAdminTest() {
        // given
        userService.saveUser(user);
        User guestUser = User.builder()
                .email(email)
                .password(password)
                .username(username)
                .role(Role.GUEST)
                .build();
        userService.saveUser(guestUser);

        // when
        User admin = userService.getAdmin();

        // then
        Assertions.assertThat(admin).isNotNull();
        Assertions.assertThat(admin.getRole()).isEqualTo(Role.ADMIN);
    }
}
