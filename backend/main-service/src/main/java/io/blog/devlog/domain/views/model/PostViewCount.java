package io.blog.devlog.domain.views.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDate;

@Table(name="POSTVIEWCOUNT", indexes = {
        @Index(name = "idx_post", columnList = "post_id, view_date"),
})
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Entity
@Getter
@Builder
@ToString
public class PostViewCount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long postId;
    private LocalDate viewDate;
    @ColumnDefault("0")
    private int viewCount;

    public PostViewCount(Long postId, LocalDate viewDate, int viewCount) {
        this.postId = postId;
        this.viewDate = viewDate;
        this.viewCount = viewCount;
    }

    public void increaseViewCount() {
        this.viewCount += 1;
    }
}
