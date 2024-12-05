package io.blog.devlog.domain.blog.service;

import io.blog.devlog.domain.blog.dto.RequestInfoDto;
import io.blog.devlog.domain.blog.dto.ResponseInfoDto;
import io.blog.devlog.domain.blog.model.Info;
import io.blog.devlog.domain.blog.repository.InfoRepository;
import io.blog.devlog.domain.user.model.User;
import io.blog.devlog.domain.user.service.UserService;
import jakarta.ws.rs.InternalServerErrorException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
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

    public void createBlogInfo(RequestInfoDto requestInfoDto) {
        // TODO: 관리자 계정을 가져오는 방법을 수정해야함.
        User user = userService.getAdmin();
        if (user == null) {
            log.error("Blog Info를 업데이트하는 과정에서 관리자 계정을 찾지 못하는 오류가 발생했습니다.");
            throw new InternalServerErrorException("정보를 업로드하는데 실패했습니다.");
        }
        Info info = requestInfoDto.toEntity(user);
        infoRepository.save(info);
    }
}
