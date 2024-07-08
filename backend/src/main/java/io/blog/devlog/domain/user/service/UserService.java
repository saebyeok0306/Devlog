package io.blog.devlog.domain.user.service;

import io.blog.devlog.domain.user.model.Role;
import io.blog.devlog.domain.user.model.User;
import io.blog.devlog.domain.user.repository.UserRepository;
import io.blog.devlog.global.jwt.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
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

    public String reissueAccessToken(HttpServletRequest request) throws BadRequestException {
        String refreshToken = jwtService.extractJWT(request).orElse(null);
        if (!jwtService.isRefreshTokenValid(refreshToken)) throw new BadRequestException("Invalid refresh token");
        User user = userRepository.findByRefreshToken(refreshToken).orElse(null);
        log.info("Refresh token : {} User : {}", refreshToken, user);
        if (user == null) throw new BadRequestException("Invalid refresh token");
        return jwtService.createAccessToken(user);
    }

    public User getAdmin() {
        List<User> users = userRepository.findAllByRole(Role.ADMIN);
        if (users.isEmpty()) return null;
        return users.get(0);
    }
}
