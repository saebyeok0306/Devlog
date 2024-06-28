package io.blog.devlog.global.jwt.service;

import io.blog.devlog.config.JwtServiceConfig;
import io.blog.devlog.domain.user.model.User;
import io.blog.devlog.domain.user.repository.UserRepository;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import java.util.Date;
import java.util.Optional;

@DataJpaTest // Component Scan을 하지 않아 컨테이너에 @Component 빈들이 등록되지 않는다.
@ActiveProfiles("test")
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class JwtServiceTest {

    @Autowired
    private UserRepository userRepository;
    private static JwtService jwtService;
    private static BCryptPasswordEncoder bCryptPasswordEncoder;
    private static User testUser;
    private static final String testUsername = "test name";
    private static final String testEmail = "a@gmail.com";
    private static final long pastTime = 826038000; // 1996년 3월 6일

    @BeforeAll
    public static void beforeAllSetUp() {
        jwtService = new JwtServiceConfig().createJwtService();
        bCryptPasswordEncoder = new BCryptPasswordEncoder();

        testUser = User.builder()
                .username(testUsername)
                .password("123")
                .email(testEmail)
                .build();
        testUser.authorizeUser();
        testUser.passwordEncode(bCryptPasswordEncoder);
    }

    @Test
    @DisplayName("AccessToken 검증")
    void jwtTest1() {
        // given
        userRepository.save(testUser);

        // when
        String token = jwtService.createAccessToken(testUser);
        System.out.println("token : " + token);

        // then
        Assertions.assertThat(jwtService.isTokenValid(token)).isTrue();
        String name = jwtService.extractUsername(token).orElse(null);
        Assertions.assertThat(name).isNotEqualTo(null);
        Assertions.assertThat(name).isEqualTo(testUsername);
    }

    @Test
    @DisplayName("RefreshToken 검증")
    void jwtTest2() {
        // given
        userRepository.save(testUser);

        // when
        String token = jwtService.createRefreshToken(testUser);
        System.out.println("token : " + token);

        // then
        Assertions.assertThat(jwtService.isTokenValid(token)).isTrue();
        String name = jwtService.extractUsername(token).orElse(null);
        Assertions.assertThat(name).isNotEqualTo(null);
        Assertions.assertThat(name).isEqualTo(testUsername);
    }

    @Test
    @DisplayName("UpdateRefreshToken 검증")
    void updateRefreshTokenTest() {
        // given
        userRepository.save(testUser);
        String token = jwtService.createRefreshToken(testUser);
        userRepository.updateRefreshTokenByEmail(testEmail, token);

        // when
        String test_token = jwtService.createRefreshToken(testUser, new Date(pastTime));
        userRepository.updateRefreshTokenByEmail(testEmail, test_token);

        // then
        Optional<User> optUser = userRepository.findByRefreshToken(test_token);
        Assertions.assertThat(optUser).isNotNull();
    }

    @Test
    @DisplayName("isTokenValid 검증 - 유효하지 않은 JWT")
    void isTokenValidTest1() {
        // given
        String token = "123";

        // when

        // then
        Assertions.assertThatThrownBy(() -> jwtService.isTokenValid(token)).isInstanceOf(JwtException.class);
    }

    @Test
    @DisplayName("isTokenValid 검증 - 만료된 토큰")
    void isTokenValidTest2() {
        // given
        userRepository.save(testUser);

        // when
        String token = jwtService.createRefreshToken(testUser, new Date(pastTime));

        // then
        Assertions.assertThatThrownBy(() -> jwtService.isTokenValid(token)).isInstanceOf(ExpiredJwtException.class);
    }
}
