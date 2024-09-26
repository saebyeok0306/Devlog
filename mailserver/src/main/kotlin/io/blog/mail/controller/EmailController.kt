package io.blog.mail.controller

import io.blog.mail.dto.AuthenticationMessage
import io.blog.mail.service.EmailService
import io.blog.mail.types.MessageType
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
class EmailController {
    @Autowired
    private lateinit var emailService : EmailService

    @PostMapping("/send")
    fun sendEmail(@RequestBody message: AuthenticationMessage) {
        emailService.sendEmail(MessageType.EMAIL, message.email, message.subject, message.authCode)
    }
}