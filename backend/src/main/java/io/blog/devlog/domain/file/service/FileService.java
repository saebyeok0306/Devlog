package io.blog.devlog.domain.file.service;

import io.blog.devlog.domain.comment.model.Comment;
import io.blog.devlog.domain.file.dto.FileDto;
import io.blog.devlog.domain.file.handler.FileHandler;
import io.blog.devlog.domain.file.model.EntityType;
import io.blog.devlog.domain.file.model.File;
import io.blog.devlog.domain.file.repository.FileRepository;
import io.blog.devlog.domain.post.model.Post;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class FileService {
    private final FileRepository fileRepository;
    private final TempFileService tempFileService;
    private final FileHandler fileHandler;

    public File addFile(File file) {
        return fileRepository.save(file);
    }

    public <T> void uploadFileAndDeleteTempFile(T original, List<FileDto> uploadFiles) {
        List<File> files = new ArrayList<>();
        for (FileDto uploadFile : uploadFiles) {
            try {
                tempFileService.deleteTempFile(uploadFile.getTempId());
                File file = null;
                if (original.getClass().equals(Post.class)) {
                    file = this.addFile(uploadFile.toEntity((Post) original));
                } else if(original.getClass().equals(Comment.class)) {
                    file = this.addFile(uploadFile.toEntity((Comment) original));
                }
                files.add(file);
            } catch (Exception e) {
                log.error("Temp file not found : " + uploadFile.getTempId());
            }
        }
    }

    public boolean deleteFileFromComment(Comment comment) throws IOException {
        File file = fileRepository.findByEntityTypeAndEntityId(EntityType.COMMENT, comment.getId()).orElse(null);
        if (file == null) return false;
        return fileHandler.deleteFile(file.getFileUrl());
    }
}
