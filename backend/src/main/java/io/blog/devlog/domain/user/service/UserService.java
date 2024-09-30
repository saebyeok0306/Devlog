package io.blog.devlog.domain.user.service;

import io.blog.devlog.domain.user.model.Role;
import io.blog.devlog.domain.user.model.User;
import io.blog.devlog.domain.user.repository.UserRepository;
import io.blog.devlog.global.exception.NullJwtException;
import io.blog.devlog.global.jwt.service.JwtService;
import io.jsonwebtoken.Claims;
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

//    public Optional<User> getUserByRefreshToken(String token) {
//        return userRepository.findByRefreshToken(token);
//    }

    public void reissueAccessToken(HttpServletRequest request, HttpServletResponse response) throws BadRequestException {
        log.info("reissueRequest : " + request.toString());
        String refreshToken = jwtService.extractRefreshJWT(request).orElse(null);
        if (refreshToken == null) {
            log.error("refreshToken is null");
            throw new NullJwtException("refreshToken is null");
        }
        if (jwtService.isTokenValid(refreshToken) && !jwtService.isRefreshTokenValid(refreshToken)) {
            // 만료된 경우에는 isTokenValid에서 따로 에러를 던짐.
            throw new BadRequestException("Invalid refresh token");
        }

        Claims claims = jwtService.extractClaims(refreshToken);
        User user = userRepository.findByEmail(jwtService.get_claim_email(claims)).orElse(null);
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
