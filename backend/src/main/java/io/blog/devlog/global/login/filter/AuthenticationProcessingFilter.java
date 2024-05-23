package io.blog.devlog.global.login.filter;

import io.blog.devlog.global.jwt.service.JwtService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
public class AuthenticationProcessingFilter extends OncePerRequestFilter {

    private final String BEARER = "Bearer ";
    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        log.info("AuthenticationProcessingFilter 호출됨");

        String token = extractToken(request).orElse(null);

        if(token != null && jwtService.isTokenValid(token)) {
            Claims claims = jwtService.extractClaims(token);
            saveAuthentication(claims);
        }

        filterChain.doFilter(request, response);
    }


    private Optional<String> extractToken(HttpServletRequest request) {
        log.info("extractToken() 호출");
        return Optional.ofNullable(request.getHeader("Authorization"))
                .filter(token -> token.startsWith(BEARER))
                .map(token -> token.replace(BEARER, ""));
    }

    private void saveAuthentication(Claims claims) throws IOException {
        log.info("saveAuthentication() 호출");
        UserDetails userDetails = User.builder()
                .username((String) claims.get("name"))
                .password("")
                .roles((String) claims.get("role"))
                .build();

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                userDetails,
                null,
                userDetails.getAuthorities()
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
    }
}