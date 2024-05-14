package io.blog.devlog.global.jwt.service;

import io.blog.devlog.domain.model.User;
import io.blog.devlog.domain.repository.UserRepository;
import jakarta.servlet.http.HttpServletResponse;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.http.HttpEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.transaction.annotation.Transactional;

import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Optional;

@DataJpaTest // Component Scan을 하지 않아 컨테이너에 @Component 빈들이 등록되지 않는다.
@TestPropertySource(locations = "classpath:application-test.yml")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class JwtServiceTest {

    @Autowired
    private UserRepository userRepository;
    private static JwtService jwtService;
    private static BCryptPasswordEncoder bCryptPasswordEncoder;
    private static User testUser;
    private static final String testUsername = "test name";

    @BeforeAll
    public static void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secret", "abcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgab");
        ReflectionTestUtils.setField(jwtService, "accessTokenExpiration", 3600);
        ReflectionTestUtils.setField(jwtService, "refreshTokenExpiration", 86400);
        jwtService.init();
        bCryptPasswordEncoder = new BCryptPasswordEncoder();

        testUser = User.builder()
                .username(testUsername)
                .password("123")
                .email("a@gmail.com")
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
        Optional<String> name = jwtService.extractUsername(token);
        Assertions.assertThat(name).isNotEqualTo(null);
        Assertions.assertThat(name.get()).isEqualTo(testUsername);
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
        Optional<String> name = jwtService.extractUsername(token);
        Assertions.assertThat(name).isNotEqualTo(null);
        Assertions.assertThat(name.get()).isEqualTo(testUsername);
    }

    @Test
    @DisplayName("UpdateRefreshToken 검증")
    void updateRefreshTokenTest() {
        // given
        userRepository.save(testUser);
        String token = jwtService.createRefreshToken(testUser);
        userRepository.updateRefreshTokenByUsername(testUsername, token);

        // when
        String test_token = jwtService.createRefreshToken(testUser, 10000);
        userRepository.updateRefreshTokenByUsername(testUsername, test_token);

        // then
        Optional<User> optUser = userRepository.findByRefreshToken(test_token);
        Assertions.assertThat(optUser).isNotNull();
    }
}
