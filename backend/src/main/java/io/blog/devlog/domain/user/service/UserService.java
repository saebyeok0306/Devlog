package io.blog.devlog.domain.user.service;

import io.blog.devlog.domain.user.model.User;
import io.blog.devlog.domain.user.repository.UserRepository;
import io.blog.devlog.global.jwt.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public void saveUser(User user) {
        userRepository.save(user);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> getUserByRefreshToken(String token) {
        return userRepository.findByRefreshToken(token);
    }

    public void updateRefreshToken(User user, String token) {
        userRepository.updateRefreshTokenByEmail(user.getEmail(), token);
    }

    public void updateRefreshToken(String email, String token) {
        userRepository.updateRefreshTokenByEmail(email, token);
    }

    public Optional<String> reissueAccessToken(HttpServletRequest request) {
        String refreshToken = jwtService.extractJWT(request).orElse(null);
        User user = userRepository.findByRefreshToken(refreshToken).orElse(null);
        if (user == null) return Optional.empty();
        return Optional.ofNullable(jwtService.createAccessToken(user));
    }
}
