package io.blog.devlog.domain.file.handler;

import io.blog.devlog.domain.file.dto.FileDto;
import io.blog.devlog.domain.file.model.FileType;
import io.blog.devlog.domain.file.model.TempFile;
import io.blog.devlog.domain.file.service.TempFileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.tomcat.util.http.fileupload.FileUploadException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class FileHandler {
    private final TempFileService tempFileService;
    @Value("${file.upload.path}")
    private String uploadPath;
    @Value("${file.request.path}")
    private String requestPath;

    public FileDto uploadFile(MultipartFile file) throws FileUploadException {
        String uploadFolderPath = this.getFolder();
        File uploadFolder = new File(uploadPath, uploadFolderPath);

        if (!uploadFolder.exists()) {
            // folder가 없으면 생성하기
            uploadFolder.mkdirs();
        }


        String fileName = this.sanitizeFileName(file.getOriginalFilename());
        String saveFileName = UUID.randomUUID() + "_" + fileName;

        try {
            File saveFile = new File(uploadFolder, saveFileName);
            file.transferTo(saveFile);
        } catch (Exception e) {
            e.printStackTrace();
        }

        FileType fileType = null;
        String contentType = file.getContentType();

        assert contentType != null;
        if(contentType.startsWith("image")) {
            fileType = FileType.IMAGE;
        } else if (contentType.startsWith("video")) {
            fileType = FileType.VIDEO;
        } else if (contentType.startsWith("audio")) {
            fileType = FileType.AUDIO;
        } else {
            fileType = FileType.FILES;
        }

        String fileUrl = uploadFolderPath + "/" + saveFileName;
        TempFile tempFile = tempFileService.addTempFile(fileUrl);
        return FileDto.builder()
                .fileName(fileName)
                .fileSize(file.getSize())
                .fileUrl(fileUrl)
                .filePath(requestPath)
                .fileType(fileType)
                .tempId(tempFile.getId())
                .build();
    }

    public String getFolder() {
        Date date = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        String folderName = sdf.format(date);
        return folderName.replace("-", "/");
    }

    private String sanitizeFileName(String fileName) {
        String INVALID_CHARS_PATTERN = "[\\\\/:*?\"<>|()\\[\\] ]";
        String INVALID_KOREA_PATTERN = "[가-힣]";
        if (fileName == null || fileName.isEmpty()) {
            return "";
        }
        return fileName.replaceAll(INVALID_CHARS_PATTERN, "").replaceAll(INVALID_KOREA_PATTERN, "");
    }
}
