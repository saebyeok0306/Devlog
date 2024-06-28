package io.blog.devlog.config;

import io.blog.devlog.global.jwt.service.JwtService;
import org.springframework.test.util.ReflectionTestUtils;

public class JwtServiceConfig {

    public JwtService createJwtService() {
        JwtService jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secret", "abcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgab");
        ReflectionTestUtils.setField(jwtService, "accessTokenExpiration", 3600);
        ReflectionTestUtils.setField(jwtService, "refreshTokenExpiration", 86400);
        jwtService.init();
        return jwtService;
    }
}
