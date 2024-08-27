package io.blog.devlog.config;

import io.blog.devlog.domain.file.handler.FileHandler;
import io.blog.devlog.domain.file.service.TempFileService;
import io.blog.devlog.domain.user.model.Role;
import io.blog.devlog.domain.user.model.User;
import io.blog.devlog.global.jwt.service.JwtService;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.ArrayList;
import java.util.List;

public class TestConfig {
    public String username = "admin";
    public String password = "password";
    public String email = "test@gmail.com";
    public Role role = Role.ADMIN;
    public String guestUsername = "guest";
    public String guestPassword = "password";
    public String guestEmail = "guest@gmail.com";
    public Role guestRole = Role.GUEST;
    public User adminUser = User.builder()
            .email(email)
            .password(password)
            .username(username)
            .role(role)
            .build();
    public User geustUser = User.builder()
            .email(guestEmail)
            .password(guestPassword)
            .username(guestUsername)
            .role(guestRole)
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

    public void updateAuthentication(User user) {
        List<GrantedAuthority> authorities = new ArrayList<>(List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole())));
        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password("")
                .authorities(authorities)
                .build();
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                userDetails,
                null,
                userDetails.getAuthorities()
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
    }
}
