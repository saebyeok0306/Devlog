package io.blog.devlog.domain.file.dto;

import io.blog.devlog.domain.file.model.FileType;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FileDto {
    private String fileName;
    private long fileSize;
    private String fileUrl;
    @Enumerated(EnumType.STRING)
    private FileType fileType;

//    public static ResponseFileDto toDto(File file) {
//        return ResponseFileDto.builder()
//                .build();
//    }
}