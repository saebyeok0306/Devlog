package io.blog.devlog.domain.info.dto;

import io.blog.devlog.domain.info.model.Info;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResponseInfoDto {
    private String username;
    private String about; // 블로그 소개글
    private String profileUrl; // 블로그 프로필 사진

    public static ResponseInfoDto toDto(Info info) {
        return ResponseInfoDto.builder()
                .username(info.getUser().getUsername())
                .about(info.getAbout())
                .profileUrl(info.getProfileUrl())
                .build();
    }
}
