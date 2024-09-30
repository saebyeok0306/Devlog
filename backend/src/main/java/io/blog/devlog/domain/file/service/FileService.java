package io.blog.devlog.domain.file.service;

import io.blog.devlog.domain.comment.model.Comment;
import io.blog.devlog.domain.file.dto.FileDto;
import io.blog.devlog.domain.file.handler.FileHandler;
import io.blog.devlog.domain.file.model.EntityType;
import io.blog.devlog.domain.file.model.File;
import io.blog.devlog.domain.file.model.TempFile;
import io.blog.devlog.domain.file.repository.FileRepository;
import io.blog.devlog.domain.post.model.Post;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
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
        for (FileDto uploadFile : uploadFiles) {
            try {
                if (uploadFile.isExist()) {
                    continue;
                }
                System.out.println("uploadFile = " + uploadFile.toString());
                tempFileService.deleteTempFile(uploadFile.getTempId());
                File file = null;
                if (original.getClass().equals(Post.class)) {
                    file = this.addFile(uploadFile.toEntity((Post) original));
                } else if(original.getClass().equals(Comment.class)) {
                    file = this.addFile(uploadFile.toEntity((Comment) original));
                }
            } catch (Exception e) {
                log.error("Temp file not found : " + uploadFile.getTempId());
            }
        }
    }

    public List<File> getFilesByPostId(Long postId) {
        return fileRepository.findByEntityTypeAndEntityId(EntityType.POST, postId);
    }

    public List<File> getFilesByCommentId(Long commentId) {
        return fileRepository.findByEntityTypeAndEntityId(EntityType.COMMENT, commentId);
    }

    public void deleteFileFromComment(Comment comment) {
        List<File> files = this.getFilesByCommentId(comment.getId());
        if (files.isEmpty()) return;
        for (File file : files) {
            try {
                fileHandler.deleteFile(file.getFileUrl());
                fileRepository.delete(file);
            } catch (IOException e) {
                log.error("File not found : " + file.getFileUrl());
            }
        }
    }

    public void deleteFileFromPost(Post post) {
        List<File> files = this.getFilesByPostId(post.getId());
        if (files.isEmpty()) return;
        for (File file : files) {
            try {
                fileHandler.deleteFile(file.getFileUrl());
                fileRepository.delete(file);
            } catch (IOException e) {
                log.error("File not found : " + file.getFileUrl());
            }
        }
    }

    public void deleteTempFiles() {
        List<TempFile> tempFiles = tempFileService.getTempFiles();
        if (tempFiles.isEmpty()) return;
        for (TempFile tempFile : tempFiles) {
            try {
                fileHandler.deleteFile(tempFile.getFileUrl());
                tempFileService.deleteTempFile(tempFile.getId());
            } catch (IOException e) {
                log.error("Temp file not found : " + tempFile.getFileUrl());
            }
        }
    }

    public void deleteUnusedFilesByPost(Post post, List<FileDto> prevFiles) {
        List<File> files = this.getFilesByPostId(post.getId());
        if (files.isEmpty()) return;
        // prevFiles에서 files와 겹치는 리스트 제거
        for (FileDto prevFile : prevFiles) {
            files.removeIf(file -> prevFile.getFileName().equals(file.getFileName()));
        }
        if (files.isEmpty()) return;
        for (File file : files) {
            try {
                log.info("Delete unused file : " + file.getFileUrl());
                fileHandler.deleteFile(file.getFileUrl());
                fileRepository.delete(file);
            } catch (IOException e) {
                log.error("File not found : " + file.getFileUrl());
            }
        }
    }

    public void deleteUnusedFilesByComment(Comment comment, List<FileDto> prevFiles) {
        List<File> files = this.getFilesByCommentId(comment.getId());
        if (files.isEmpty()) return;
        // prevFiles에서 files와 겹치는 리스트 제거
        for (FileDto prevFile : prevFiles) {
            files.removeIf(file -> prevFile.getFileName().equals(file.getFileName()));
        }
        if (files.isEmpty()) return;
        for (File file : files) {
            try {
                log.info("Delete unused file : " + file.getFileUrl());
                fileHandler.deleteFile(file.getFileUrl());
                fileRepository.delete(file);
            } catch (IOException e) {
                log.error("File not found : " + file.getFileUrl());
            }
        }
    }
}
