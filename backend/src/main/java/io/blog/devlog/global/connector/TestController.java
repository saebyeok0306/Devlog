package io.blog.devlog.global.connector;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @RequestMapping("/long-process")
    public String pause() throws InterruptedException {
        Thread.sleep(10000);
        return "Process finished";
    }
}
