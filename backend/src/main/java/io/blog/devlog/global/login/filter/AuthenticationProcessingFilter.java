package io.blog.devlog.global.login.filter;

import io.blog.devlog.domain.user.model.Role;
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
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
public class AuthenticationProcessingFilter extends OncePerRequestFilter {

    private final String BEARER = "Bearer ";
    private final ErrorResponse errorResponse;
    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        log.info("AuthenticationProcessingFilter 호출됨 {}", request.getRequestURI());

        String token = jwtService.extractJWT(request).orElse(null);

        if(token != null) {
            try {
                if (jwtService.isTokenValid(token)) {
                    Claims claims = jwtService.extractClaims(token);
                    createUserDetails(claims);
                }
            }
            catch (ExpiredJwtException e) {
                if (request.getRequestURI().equals("/reissue")) {
                    filterChain.doFilter(request, response);
                    return;
                }
                Integer status = HttpServletResponse.SC_UNAUTHORIZED;
                String path = request.getRequestURI();
                errorResponse.setResponse(response, status, e.getMessage(), path);
                return;
            }
            catch (JwtException e) {
                // invalid token
                Integer status = HttpServletResponse.SC_UNAUTHORIZED;
                String path = request.getRequestURI();
                errorResponse.setResponse(response, status, e.getMessage(), path);
                return;
            }
        }
        else {
            // GUEST
            createUserDetails();
        }

        filterChain.doFilter(request, response);
    }

    private void createUserDetails(Claims claims) throws IOException {
        log.info("saveAuthentication(Claims) 호출");
        List<GrantedAuthority> authorities = new ArrayList<>(List.of(new SimpleGrantedAuthority("ROLE_" + claims.get("role"))));
        UserDetails userDetails = User.builder()
                .username((String) claims.get("email"))
                .password("")
//                .roles((String) claims.get("role"))
                .authorities(authorities)
                .build();

        saveAuthentication(userDetails);
    }

    private void createUserDetails() {
        log.info("createUserDetails(GUEST) 호출");
        List<GrantedAuthority> authorities = new ArrayList<>(List.of(new SimpleGrantedAuthority("ROLE_" + Role.GUEST)));
        UserDetails userDetails = User.builder()
                .username("GUEST")
                .password("")
                .authorities(authorities)
                .build();

        saveAuthentication(userDetails);
    }

    private void saveAuthentication(UserDetails userDetails) {
        log.info("saveAuthentication(UserDetails) 호출");
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                userDetails,
                null,
                userDetails.getAuthorities()
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
    }
}