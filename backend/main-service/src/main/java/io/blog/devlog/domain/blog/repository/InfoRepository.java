package io.blog.devlog.domain.blog.repository;

import io.blog.devlog.domain.blog.model.Info;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InfoRepository extends JpaRepository<Info, Long> {
}
