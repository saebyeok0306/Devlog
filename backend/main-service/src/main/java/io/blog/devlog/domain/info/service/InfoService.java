package io.blog.devlog.domain.info.service;

import io.blog.devlog.domain.info.dto.RequestInfoDto;
import io.blog.devlog.domain.info.dto.ResponseInfoDto;
import io.blog.devlog.domain.info.model.Info;
import io.blog.devlog.domain.info.repository.InfoRepository;
import io.blog.devlog.domain.user.model.User;
import io.blog.devlog.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class InfoService {
    private final InfoRepository infoRepository;
    private final UserService userService;

    public ResponseInfoDto getBlogInfo() {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        PageRequest pageRequest = PageRequest.of(0, 1, sort);
        List<Info> infoList = infoRepository.findAll(pageRequest).getContent();
        return infoList.isEmpty() ? ResponseInfoDto.toNullDto() : ResponseInfoDto.toDto(infoList.get(0));
    }

    public boolean createBlogInfo(RequestInfoDto requestInfoDto) {
        // TODO: 관리자 계정을 가져오는 방법을 수정해야함.
        User user = userService.getAdmin();
        if (user == null) return false;
        Info info = requestInfoDto.toEntity(user);
        infoRepository.save(info);
        return true;
    }
}
