package io.blog.devlog.domain.post.model;

import io.blog.devlog.domain.category.model.Category;
import io.blog.devlog.domain.file.model.File;
import io.blog.devlog.domain.user.model.User;
import io.blog.devlog.global.time.BaseTime;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Entity
@Getter
@Builder
@ToString
public class Post extends BaseTime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String title;
    private String content;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
    @OneToMany(mappedBy = "post")
    private List<File> files;
    private long views;
    private long likes;
//    private long comment;
//    private String tag;
}
