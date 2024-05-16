package io.blog.devlog.domain.controller;

import io.blog.devlog.domain.dto.UserDto;
import io.blog.devlog.domain.model.User;
import io.blog.devlog.domain.repository.UserRepository;
import io.blog.devlog.global.response.ErrorResponse;
import io.blog.devlog.global.response.SuccessResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@RestController
public class AuthController {

    private final UserRepository userRepository;
    private final ErrorResponse errorResponse;
    private final SuccessResponse successResponse;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @PostMapping("/join")
    public void join(HttpServletRequest request, HttpServletResponse response, @Valid @RequestBody UserDto userDto) throws IOException {
        log.info("POST /join UserDto : {}", userDto);

        Optional<User> userEntity = userRepository.findByEmail(userDto.getEmail());
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
        userRepository.save(user);

        Integer status = HttpServletResponse.SC_OK;
        String message = "가입 성공";
        successResponse.setResponse(response, status, message, request.getRequestURI());
    }
}
