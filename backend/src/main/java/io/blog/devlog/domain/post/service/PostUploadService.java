package io.blog.devlog.domain.post.service;

import io.blog.devlog.domain.category.model.Category;
import io.blog.devlog.domain.category.service.CategoryService;
import io.blog.devlog.domain.file.model.File;
import io.blog.devlog.domain.file.service.FileService;
import io.blog.devlog.domain.file.service.TempFileService;
import io.blog.devlog.domain.post.dto.RequestPostDto;
import io.blog.devlog.domain.post.model.Post;
import io.blog.devlog.domain.post.repository.PostRepository;
import io.blog.devlog.domain.user.model.User;
import io.blog.devlog.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class PostUploadService {
    private final PostRepository postRepository;
    private final UserService userService;
    private final CategoryService categoryService;
    private final FileService fileService;
    private final TempFileService tempFileService;

    public Post savePost(RequestPostDto requestPostDto) throws BadRequestException {
        String email = requestPostDto.getEmail();
        User user = userService.getUserByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found : " + email));
        Category category = categoryService.getCategoryById(requestPostDto.getCategoryId())
                .orElseThrow(() -> new BadRequestException("Category not found : " + requestPostDto.getCategoryId()));

        Post post = postRepository.save(requestPostDto.toEntity(user, category));

        List<File> files = new ArrayList<>();
        for (int i = 0; i < requestPostDto.getFiles().size(); i++) {
            try {
                tempFileService.deleteTempFile(requestPostDto.getFiles().get(i).getTempId());
                File file = fileService.addFile(requestPostDto.getFiles().get(i).toEntity(post));
                files.add(file);
            }
            catch (Exception e) {
                log.error("Temp file not found : " + requestPostDto.getFiles().get(i).getTempId());
            }
        }
        return post;
    }
}
