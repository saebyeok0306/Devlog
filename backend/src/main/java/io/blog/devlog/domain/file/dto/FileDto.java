package io.blog.devlog.domain.file.dto;

import io.blog.devlog.domain.comment.model.Comment;
import io.blog.devlog.domain.file.model.EntityType;
import io.blog.devlog.domain.file.model.File;
import io.blog.devlog.domain.file.model.FileType;
import io.blog.devlog.domain.post.model.Post;
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
    private long tempId; // temp_file_id
    private String fileName; // "5.PNG"
    private long fileSize; // bytes
    private String fileUrl; // "2024/06/27/b3dd4c9d-1f71-4252-adfb-b0475bc1ecf2_5.PNG"
    private String filePath; // res
    @Enumerated(EnumType.STRING)
    private FileType fileType;

    public File toEntity() {
        return File.builder()
                .fileName(this.fileName)
                .fileSize(this.fileSize)
                .fileUrl(this.fileUrl)
                .filePath(this.filePath)
                .fileType(this.fileType)
                .build();
    }

    public File toEntity(Post post) {
        return this.toEntity().setEntity(EntityType.POST, post.getId());
    }

    public File toEntity(Comment comment) {
        return this.toEntity().setEntity(EntityType.COMMENT, comment.getId());
    }

    public static FileDto of(File file) {
        return FileDto.builder()
                .tempId(file.getId())
                .fileName(file.getFileName())
                .fileSize(file.getFileSize())
                .fileUrl(file.getFileUrl())
                .filePath(file.getFilePath())
                .fileType(file.getFileType())
                .build();
    }
}