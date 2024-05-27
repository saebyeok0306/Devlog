package io.blog.devlog.domain.user.model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Role {
    GUEST("ROLE_GUEST"),
    USER("ROLE_USER"),
    PARTNER("ROLE_PARTNER"),
    ADMIN("ROLE_ADMIN");
    private final String key;
}
