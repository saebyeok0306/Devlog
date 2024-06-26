package io.blog.devlog.domain.file.model;

import io.blog.devlog.domain.post.model.Post;
import io.blog.devlog.global.time.CreateTime;
import jakarta.persistence.*;
import lombok.*;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Entity
@Getter
@Builder
@ToString
public class File extends CreateTime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String fileName;
    private String fileUrl;
    private long fileSize;
    @Enumerated(EnumType.STRING)
    private FileType fileType;
    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post post;
}
