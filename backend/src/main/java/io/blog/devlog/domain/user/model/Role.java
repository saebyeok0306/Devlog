package io.blog.devlog.domain.user.model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Role {
    GUEST(0, "ROLE_GUEST"),
    USER(1, "ROLE_USER"),
    PARTNER(2, "ROLE_PARTNER"),
    ADMIN(3, "ROLE_ADMIN");
    private final int key;
    private final String nameKey;

    public static Role fromNameKey(String nameKey) {
        for (Role role : Role.values()) {
            if (role.getNameKey().equals(nameKey)) {
                return role;
            }
        }
        throw new IllegalArgumentException("Invalid string key: " + nameKey);
    }
}
