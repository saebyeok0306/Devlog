package io.blog.devlog.domain.post.model;

import io.blog.devlog.domain.category.model.Category;
import io.blog.devlog.domain.user.model.User;
import io.blog.devlog.global.time.BaseTime;
import jakarta.persistence.*;
import lombok.*;

@Table(name="POST", indexes = {
        @Index(name = "idx_url", columnList = "url"),
})
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Entity
@Getter
@Builder
@ToString
public class Post extends BaseTime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true)
    private String url;
    private String title;
    @Column(length = 50000)
    private String content;
    private String previewUrl;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;
//    @OneToMany(mappedBy = "post")
//    private List<File> files;
    private long views;
//    private long likes;
    private boolean isPrivate;
//    private long comment;
//    private String tag;
}