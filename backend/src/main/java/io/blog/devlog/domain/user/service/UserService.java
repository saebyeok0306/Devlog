package io.blog.devlog.domain.user.service;

import io.blog.devlog.domain.user.model.Role;
import io.blog.devlog.domain.user.model.User;
import io.blog.devlog.domain.user.repository.UserRepository;
import io.blog.devlog.global.jwt.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class UserService {
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> getUserByRefreshToken(String token) {
        return userRepository.findByRefreshToken(token);
    }

    public void reissueAccessToken(HttpServletRequest request, HttpServletResponse response) throws BadRequestException {
        String refreshToken = jwtService.extractRefreshJWT(request).orElse(null);
        if (refreshToken == null || (jwtService.isTokenValid(refreshToken) && !jwtService.isRefreshTokenValid(refreshToken)))
            throw new BadRequestException("Invalid refresh token");

        User user = userRepository.findByRefreshToken(refreshToken).orElse(null);
        if (user == null) throw new BadRequestException("Invalid refresh token");
        String newAccessToken = jwtService.createAccessToken(user);
        jwtService.sendAccessToken(response, newAccessToken);
    }

    public void logout(HttpServletResponse response) {
        jwtService.expireTokenCookie(response);
    }

    public User getAdmin() {
        List<User> users = userRepository.findAllByRole(Role.ADMIN);
        if (users.isEmpty()) return null;
        return users.get(0);
    }

    public boolean isAdmin(User user) {
        return user.getRole() == Role.ADMIN;
    }
}
