package io.blog.devlog.domain.file.controller;

import io.blog.devlog.domain.file.dto.FileDto;
import io.blog.devlog.domain.file.handler.FileHandler;
import io.blog.devlog.domain.file.model.File;
import io.blog.devlog.domain.file.service.FileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.tomcat.util.http.fileupload.FileUploadException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/files")
@Slf4j
public class FileController {
    private final FileHandler fileHandler;
    private final FileService fileService;

    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_PARTNER')")
    public ResponseEntity<FileDto> uploadFiles(@RequestParam("file") MultipartFile file) {
        /* 여기서는 TempFile 테이블에만 올리고, 가공한 FileDto 데이터를 Response함. 업로드 단계에서 TempFile을 삭제하고 File로 Upload */
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        log.info("File uploaded : " + file.getOriginalFilename());
        log.info("File type : " + file.getContentType());
        FileDto fileDto = fileHandler.uploadFile(file);
        return ResponseEntity.ok(fileDto);
    }

    @GetMapping("/post/{entityId}")
    public ResponseEntity<List<FileDto>> getPostFiles(@PathVariable Long entityId) {
        List<File> postFiles = fileService.getFilesByPostId(entityId);
        return ResponseEntity.ok(postFiles.stream().map(FileDto::of).toList());
    }

    @GetMapping("/comment/{entityId}")
    public ResponseEntity<List<FileDto>> getCommentFiles(@PathVariable Long entityId) {
        List<File> postFiles = fileService.getFilesByCommentId(entityId);
        return ResponseEntity.ok(postFiles.stream().map(FileDto::of).toList());
    }
}
