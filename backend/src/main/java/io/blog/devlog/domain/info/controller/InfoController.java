package io.blog.devlog.domain.info.controller;

import io.blog.devlog.domain.info.model.Info;
import io.blog.devlog.domain.info.repository.InfoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/info")
public class InfoController {
    private final InfoRepository infoRepository;

//    @GetMapping
//    public Info getInfo() {
//        // 이전 데이터는 남기고, 가장 마지막에 추가한 데이터를 넣자.
//    }
}
