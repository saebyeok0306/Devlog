package io.blog.mail

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class MailserverApplication

fun main(args: Array<String>) {
	runApplication<MailserverApplication>(*args)
}
