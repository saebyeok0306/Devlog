package io.blog.devlog.domain.info.service;

import io.blog.devlog.domain.info.dto.InfoDto;
import io.blog.devlog.domain.info.model.Info;
import io.blog.devlog.domain.info.repository.InfoRepository;
import io.blog.devlog.domain.user.model.Role;
import io.blog.devlog.domain.user.model.User;
import io.blog.devlog.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class InfoService {
    private final InfoRepository infoRepository;
    private final UserRepository userRepository;

    public InfoDto getBlogInfo() {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        PageRequest pageRequest = PageRequest.of(0, 1, sort);
        Info info = infoRepository.findAll(pageRequest).getContent().getFirst();
        return InfoDto.toDto(info);
    }

    public boolean createBlogInfo(InfoDto infoDto) {
        User user = userRepository.findByRole(Role.ADMIN).orElse(null);
        if (user == null) return false;
        Info info = Info.builder()
                .about(infoDto.getAbout())
                .profileUrl(infoDto.getProfileUrl())
                .user(user)
                .build();
        infoRepository.save(info);
        return true;
    }
}
