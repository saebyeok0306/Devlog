package io.blog.devlog.domain.user.model;

import io.blog.devlog.global.time.BaseTime;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

// 기본 생성자의 접근 수준을 Protected로 설정합니다.
@Table(name="USERS")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Getter
public class User extends BaseTime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @NotNull
    private String username;
    @NotNull
    private String password;
    @NotNull
    private String email;
    @Nullable
    @Column(name = "profile_url")
    private String profileUrl;
    @Enumerated(EnumType.STRING)
    private Role role;
    @Nullable
    private String provider;
    @Nullable
    @Column(name = "provider_id")
    private String providerId;
    @Nullable
    @Column(name = "refresh_token")
    private String refreshToken;

    @Builder
    public User(String username, String password, String email, Role role, String provider, String providerId) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = role;
        this.provider = provider;
        this.providerId = providerId;
    }

    public void passwordEncode(BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.password = bCryptPasswordEncoder.encode(this.password);
    }

    public void authorizeUser() {
        this.role = Role.GUEST;
    }

    public void updateRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public void updateProfile(String url) {
        this.profileUrl = url;
    }
}
