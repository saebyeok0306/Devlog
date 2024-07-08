package io.blog.devlog.global.utils;

import io.blog.devlog.domain.user.model.Role;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

public class SecurityUtils {

    public static Role getPrincipalRole() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null) {
            return Role.GUEST;
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof UserDetails) {
            Collection<? extends GrantedAuthority> authorities = ((UserDetails) principal).getAuthorities();
            for (GrantedAuthority authority : authorities) {
                try {
                return Role.fromNameKey(authority.getAuthority());
                } catch (IllegalArgumentException e) {
                    return null;
                }
            }
        }
        return null;
    }
}
