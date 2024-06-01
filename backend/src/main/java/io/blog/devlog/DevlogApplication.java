package io.blog.devlog;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.ApplicationPidFileWriter;

@SpringBootApplication
public class DevlogApplication {

	public static void main(String[] args) {
//		SpringApplication.run(DevlogApplication.class, args);
		SpringApplication application = new SpringApplicationBuilder()
				.sources(DevlogApplication.class)
				.listeners(new ApplicationPidFileWriter("./server.pid"))
				.build();
		application.run(args);
	}

}
