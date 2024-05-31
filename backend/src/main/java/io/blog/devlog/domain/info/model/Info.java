package io.blog.devlog.domain.info.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Entity
@Getter
@Builder
@ToString
public class Info {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String about; // 블로그 소개글
    private String profileUrl; // 블로그 프로필 사진
}
