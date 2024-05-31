package io.blog.devlog.global.login.filter;

import io.blog.devlog.global.jwt.service.JwtService;
import io.blog.devlog.global.response.ErrorResponse;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
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
    private final ErrorResponse errorResponse;
    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        log.info("AuthenticationProcessingFilter 호출됨");

        String token = jwtService.extractJWT(request).orElse(null);

        if(token != null) {
            try {
                if (jwtService.isTokenValid(token)) {
                    Claims claims = jwtService.extractClaims(token);
                    saveAuthentication(claims);
                }
            }
            catch (ExpiredJwtException e) {
                Integer status = HttpServletResponse.SC_UNAUTHORIZED;
                String path = request.getRequestURI();
                errorResponse.setResponse(response, status, e.getMessage(), path);
                return;
            }
            catch (JwtException e) {
                // invalid token
                Integer status = HttpServletResponse.SC_BAD_REQUEST;
                String path = request.getRequestURI();
                errorResponse.setResponse(response, status, e.getMessage(), path);
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private void saveAuthentication(Claims claims) throws IOException {
        log.info("saveAuthentication() 호출");
        log.info("getAuthentication() : ", SecurityContextHolder.getContext().getAuthentication());
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