package io.blog.devlog.config;

import io.blog.devlog.domain.file.handler.FileHandler;
import io.blog.devlog.domain.file.service.TempFileService;
import io.blog.devlog.global.jwt.service.JwtService;
import org.springframework.test.util.ReflectionTestUtils;

public class TestConfig {

    public JwtService createJwtService() {
        JwtService jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secret", "abcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgab");
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
