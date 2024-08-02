package io.blog.devlog.config;

import io.blog.devlog.domain.file.handler.FileHandler;
import io.blog.devlog.domain.file.service.TempFileService;
import io.blog.devlog.domain.user.model.Role;
import io.blog.devlog.domain.user.model.User;
import io.blog.devlog.global.jwt.service.JwtService;
import org.springframework.test.util.ReflectionTestUtils;

public class TestConfig {
    public String username = "admin";
    public String password = "password";
    public String email = "test@gmail.com";
    public User adminUser = User.builder()
            .email(email)
            .password(password)
            .username(username)
            .role(Role.ADMIN)
            .build();

    public JwtService createJwtService() {
        JwtService jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secret", "abcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgab");
        ReflectionTestUtils.setField(jwtService, "accessHeader", "Authorization");
        ReflectionTestUtils.setField(jwtService, "refreshHeader", "Authorization-Refresh");
        ReflectionTestUtils.setField(jwtService, "accessTokenExpiration", 3600);
        ReflectionTestUtils.setField(jwtService, "refreshTokenExpiration", 86400);
        jwtService.init();
        return jwtService;
    }

    public FileHandler createFileHandler(TempFileService tempFileService) {
        FileHandler fileHandler = new FileHandler(tempFileService);
        ReflectionTestUtils.setField(fileHandler, "uploadPath", "C:\\Programming\\Blog\\devlog\\backend\\src\\main\\resources\\upload");
        ReflectionTestUtils.setField(fileHandler, "requestPath", "res");
        return fileHandler;
    }
}
