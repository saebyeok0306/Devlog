package io.blog.devlog.domain.info.service;

import io.blog.devlog.config.TestConfig;
import io.blog.devlog.domain.info.dto.RequestInfoDto;
import io.blog.devlog.domain.info.dto.ResponseInfoDto;
import io.blog.devlog.domain.info.model.Info;
import io.blog.devlog.domain.info.repository.InfoRepository;
import io.blog.devlog.domain.user.model.Role;
import io.blog.devlog.domain.user.model.User;
import io.blog.devlog.domain.user.repository.UserRepository;
import io.blog.devlog.domain.user.service.UserService;
import io.blog.devlog.global.jwt.service.JwtService;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

@DataJpaTest // Component Scan을 하지 않아 컨테이너에 @Component 빈들이 등록되지 않는다.
@ActiveProfiles("test")
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class InfoServiceTest {
    @Autowired
    private InfoRepository infoRepository;
    @Autowired
    private UserRepository userRepository;

    private InfoService infoService;

    @BeforeEach
    public void beforeSetUp() {
        JwtService jwtService = new TestConfig().createJwtService();
        UserService userService = new UserService(userRepository, jwtService);
        infoService = new InfoService(infoRepository, userService);
    }

    @Test
    @DisplayName("블로그 정보 조회 - 빈 정보")
    public void getBlogInfoEmptyTest() {
        // given
        // when
        ResponseInfoDto blogInfo = infoService.getBlogInfo();
        // then
        Assertions.assertThat(blogInfo).isEqualTo(ResponseInfoDto.toNullDto());
    }

    @Test
    @DisplayName("블로그 정보 갱신")
    public void setBlogInfoTest() {
        // given
        User adminUser = User.builder()
                .email("westreed@naver.com")
                .password("password")
                .username("westreed")
                .role(Role.ADMIN)
                .build();
        userRepository.save(adminUser);
        RequestInfoDto requestInfoDto = RequestInfoDto.builder()
                .about("블로그 소개")
                .profileUrl("프로필 사진")
                .build();

        // when
        infoService.createBlogInfo(requestInfoDto);
        ResponseInfoDto blogInfo = infoService.getBlogInfo();

        // then
        Assertions.assertThat(blogInfo.getAbout()).isEqualTo(requestInfoDto.getAbout());
        Assertions.assertThat(blogInfo.getProfileUrl()).isEqualTo(requestInfoDto.getProfileUrl());
        Assertions.assertThat(blogInfo.getUsername()).isEqualTo(adminUser.getUsername());
    }
}
