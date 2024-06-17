package io.blog.devlog.domain.user.controller;

import io.blog.devlog.domain.user.dto.UserDto;
import io.blog.devlog.domain.user.model.User;
import io.blog.devlog.domain.user.repository.UserRepository;
import io.blog.devlog.domain.user.service.UserService;
import io.blog.devlog.global.jwt.service.JwtService;
import io.blog.devlog.global.response.ErrorResponse;
import io.blog.devlog.global.response.SuccessResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@RestController
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;
    private final ErrorResponse errorResponse;
    private final SuccessResponse successResponse;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @PostMapping("/join")
    public void join(HttpServletRequest request, HttpServletResponse response, @Valid @RequestBody UserDto userDto) throws IOException {
        log.info("POST /join UserDto : {}", userDto);

        Optional<User> userEntity = userService.getUserByEmail(userDto.getEmail());
        if (userEntity.isPresent()) {
            Integer status = HttpServletResponse.SC_BAD_REQUEST;
            String error = "이미 가입된 유저입니다.";
            String path = request.getRequestURI();
            errorResponse.setResponse(response, status, error, path);
            return;
        }

        if(userDto.getUsername().isEmpty() || userDto.getEmail().isEmpty() || userDto.getPassword().isEmpty()) {
            Integer status = HttpServletResponse.SC_BAD_REQUEST;
            String error = "잘못된 입력 정보입니다.";
            String path = request.getRequestURI();
            errorResponse.setResponse(response, status, error, path);
            return;
        }

        User user = User.builder()
                .username(userDto.getUsername())
                .password(userDto.getPassword())
                .email(userDto.getEmail())
                .build();

        user.authorizeUser();
        user.passwordEncode(bCryptPasswordEncoder);
        userService.saveUser(user);

        Integer status = HttpServletResponse.SC_OK;
        String message = "가입 성공";
        successResponse.setResponse(response, status, message, request.getRequestURI());
    }

    @GetMapping("/check")
    public void check() {

    }

    @GetMapping("/reissue")
    public void reissue(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String accessToken = userService.reissueAccessToken(request);
        if (accessToken == null) {
            log.error("토큰 재발급 중 사용자 계정에 문제가 있음.");
            Integer status = HttpServletResponse.SC_BAD_REQUEST;
            String error = "잘못된 사용자 계정입니다.";
            String path = request.getRequestURI();
            errorResponse.setResponse(response, status, error, path);
            return;
        }

        jwtService.sendAccessToken(response, accessToken);
    }
}
