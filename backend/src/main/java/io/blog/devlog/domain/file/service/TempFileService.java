package io.blog.devlog.domain.file.service;

import io.blog.devlog.domain.file.model.TempFile;
import io.blog.devlog.domain.file.repository.TempFileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class TempFileService {
    private final TempFileRepository tempFileRepository;

    public TempFile addTempFile(String fileUrl) {
        TempFile tempFile = TempFile.builder()
                .fileUrl(fileUrl)
                .build();
        return tempFileRepository.save(tempFile);
    }

    public void deleteTempFile(Long id) {
        tempFileRepository.deleteById(id);
    }
}
