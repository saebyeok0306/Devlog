package io.blog.devlog.domain.comment.model;

import io.blog.devlog.domain.comment.dto.RequestEditCommentDto;
import io.blog.devlog.domain.post.model.Post;
import io.blog.devlog.domain.user.model.User;
import io.blog.devlog.global.time.BaseTime;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

@Table(name="COMMENTS", indexes = {
        @Index(name = "idx_post_id", columnList = "post_id"),
})
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Entity
@Getter
@Builder
@ToString
public class Comment extends BaseTime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    private Post post;
    @Nullable
    @JoinColumn(name = "parent_id")
    private Long parent; // 대댓글
    @Setter
    @Column(length = 5000)
    private String content;
    private boolean isPrivate;
    @Setter
    @ColumnDefault("0")
    private boolean isDeleted;

    public Comment toEdit(RequestEditCommentDto requestEditCommentDto) {
        this.content = requestEditCommentDto.getContent();
        this.isPrivate = requestEditCommentDto.isPrivate();
        return this;
    }
}
