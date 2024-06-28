package io.blog.devlog.domain.info.model;

import io.blog.devlog.domain.user.model.User;
import io.blog.devlog.global.time.CreateTime;
import jakarta.persistence.*;
import lombok.*;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Entity
@Getter
@Builder
@ToString
public class Info extends CreateTime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @ManyToOne(cascade = CascadeType.MERGE, targetEntity = User.class)
    @JoinColumn(name="user_id", updatable = false)
    private User user;
    private String about; // 블로그 소개글
    @Column(name = "profile_url")
    private String profileUrl; // 블로그 프로필 사진
}
