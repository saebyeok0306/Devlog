package io.blog.devlog.domain.user.dto;

import io.blog.devlog.domain.user.model.Role;
import io.blog.devlog.domain.user.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResponseUserProfileDto {
    private String username;
    private String email;
    private String profileUrl;
    private Role role;

    public static ResponseUserProfileDto of(User user) {
        return new ResponseUserProfileDto(user.getUsername(), user.getEmail(), user.getProfileUrl(), user.getRole());
    }
}
