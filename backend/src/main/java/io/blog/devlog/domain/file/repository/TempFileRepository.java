package io.blog.devlog.domain.file.repository;

import io.blog.devlog.domain.file.model.TempFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TempFileRepository extends JpaRepository<TempFile, Integer> {
}
