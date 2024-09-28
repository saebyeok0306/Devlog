package io.blog.mail.mail.service

import io.blog.mail.mail.types.MessageType
import jakarta.mail.internet.MimeMessage
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.mail.javamail.MimeMessageHelper
import org.springframework.stereotype.Service
import org.thymeleaf.context.Context
import org.thymeleaf.spring6.SpringTemplateEngine
import java.util.Random

@Service
class EmailServiceImpl : EmailService {
    @Autowired
    private lateinit var emailSender: JavaMailSender
    @Autowired
    private lateinit var templateEngine: SpringTemplateEngine

    override fun sendEmail(type: MessageType, email: String, subject: String, authCode: String) {
        val mimeMessage: MimeMessage = emailSender.createMimeMessage()
//        val authCode = this.createAuthCode()

        try {
            val helper = MimeMessageHelper(mimeMessage, true, "utf-8")
            helper.setTo(email)
            helper.setSubject(subject)
            helper.setText(this.setContext(type, authCode), true)
            emailSender.send(mimeMessage)
        } catch (e : Exception) {
            println("Failed to send email")
        }
    }

    override fun createAuthCode(): String {
        val random: Random = Random()
        val sb = StringBuffer()

        for (i in 0..7) {
            val index = random.nextInt(4)

            when (index) {
                0 -> sb.append((random.nextInt(26) + 65).toChar())
                1 -> sb.append((random.nextInt(26) + 97).toChar())
                else -> sb.append(random.nextInt(10))
            }
        }

        return sb.toString()
    }

    override fun setContext(type: MessageType, authCode: String): String {
        val context = Context()
        context.setVariable("authCode", authCode)
        return templateEngine.process(type.name, context)
    }
}