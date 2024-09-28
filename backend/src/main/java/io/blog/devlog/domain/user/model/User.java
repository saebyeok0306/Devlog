package io.blog.devlog.domain.user.model;

import io.blog.devlog.domain.user.dto.RequestPasswordDto;
import io.blog.devlog.global.exception.NotMatchPasswordException;
import io.blog.devlog.global.time.BaseTime;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

// 기본 생성자의 접근 수준을 Protected로 설정합니다.
@Table(name="USERS", indexes = {
        @Index(name = "idx_email", columnList = "email"),
})
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Getter
public class User extends BaseTime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull
    private String username;
    @NotNull
    private String password;
    @NotNull
    @Column(unique = true)
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
    @Column(name = "refresh_token", length = 500)
    private String refreshToken;
    @NotNull
    @ColumnDefault("0") // false
    private Boolean certificate = false;

    @Builder
    public User(String username, String password, String email, Role role, String provider, String providerId, Boolean certificate) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = role;
        this.provider = provider;
        this.providerId = providerId;
        this.certificate = certificate != null && certificate;
    }

    public void passwordEncode(BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.password = bCryptPasswordEncoder.encode(this.password);
    }

    public void updatePassword(BCryptPasswordEncoder bCryptPasswordEncoder, RequestPasswordDto requestPasswordDto) {
        if (!bCryptPasswordEncoder.matches(requestPasswordDto.getCurrentPassword(), this.password)) {
            throw new NotMatchPasswordException("비밀번호가 일치하지 않습니다.");
        }
        this.password = bCryptPasswordEncoder.encode(requestPasswordDto.getNewPassword());
    }

    public void updateRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public void updateProfile(String url) {
        this.profileUrl = url;
    }

    public void certified() {
        this.certificate = true;
    }
}
