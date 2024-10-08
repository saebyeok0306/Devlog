package io.blog.devlog.domain.post.model;

import io.blog.devlog.global.time.CreateTime;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.domain.Persistable;

import java.sql.Timestamp;

@Table(name="POSTVIEWS", indexes = {
        @Index(name = "idx_post", columnList = "post_id"),
})
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Entity
@Getter
@Builder
@ToString
public class PostViews implements Persistable<PostViewsId> {
    @EmbeddedId
    private PostViewsId id;

//    @MapsId("postId")
//    @ManyToOne
//    @JoinColumn(name = "post_id")
//    private Post post;
//    @MapsId("userIp")
//    @JoinColumn(name = "user_ip")
//    private String user;
    @Setter
    private Timestamp viewsAt;

    @Override
    public boolean isNew() {
        return getViewsAt() == null;
    }
}
