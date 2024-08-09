package io.blog.devlog.domain.file.controller;

import io.blog.devlog.domain.file.dto.FileDto;
import io.blog.devlog.domain.file.handler.FileHandler;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.tomcat.util.http.fileupload.FileUploadException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RequiredArgsConstructor
@RestController
@RequestMapping("/files")
@Slf4j
public class FileController {
    private final FileHandler fileHandler;
    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_PARTNER')")
    public ResponseEntity<FileDto> uploadFiles(@RequestParam("file") MultipartFile file) throws FileUploadException {
        /* 여기서는 TempFile 테이블에만 올리고, 가공한 FileDto 데이터를 Response함. 업로드 단계에서 TempFile을 삭제하고 File로 Upload */
        if (file.isEmpty()) {
            System.out.println("File is empty");
            return ResponseEntity.badRequest().build();
        }
        System.out.println("File uploaded : " + file.getOriginalFilename());
        System.out.println("File type : " + file.getContentType());
        FileDto fileDto = fileHandler.uploadFile(file);
        return ResponseEntity.ok(fileDto);
    }
}
