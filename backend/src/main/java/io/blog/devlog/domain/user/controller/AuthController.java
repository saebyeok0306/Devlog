package io.blog.devlog.domain.user.controller;

import io.blog.devlog.domain.user.dto.ResponseUserProfileDto;
import io.blog.devlog.domain.user.dto.UserDto;
import io.blog.devlog.domain.user.model.User;
import io.blog.devlog.domain.user.service.UserService;
import io.blog.devlog.global.response.ErrorResponse;
import io.blog.devlog.global.response.SuccessResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Optional;

import static io.blog.devlog.global.utils.SecurityUtils.getUserEmail;

@Slf4j
@RequiredArgsConstructor
@RestController
public class AuthController {

    private final UserService userService;
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
        log.info("GET /check");
    }

    @GetMapping("/profile")
    public ResponseEntity<ResponseUserProfileDto> getProfile() throws BadRequestException {
        String userEmail = getUserEmail();
        if (userEmail == null) throw new BadRequestException("로그인이 필요합니다.");
        log.info("GET /profile userEmail : {}", userEmail);
        User user = userService.getUserByEmail(userEmail).orElseThrow(() -> new BadRequestException("잘못된 요청입니다."));
        return ResponseEntity.ok(ResponseUserProfileDto.of(user));
    }

    @GetMapping("/reissue")
    public void reissue(HttpServletRequest request, HttpServletResponse response) throws IOException {
        userService.reissueAccessToken(request, response);
    }

    @GetMapping("/signout")
    public void logout(HttpServletResponse response) {
        log.info("GET /signout");
        userService.logout(response);
    }
}
