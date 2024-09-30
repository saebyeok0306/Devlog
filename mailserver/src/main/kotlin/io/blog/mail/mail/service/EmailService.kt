package io.blog.mail.mail.service

import io.blog.mail.mail.types.MessageType

interface EmailService {
    fun sendEmail(type: MessageType, email: String, subject: String, authCode: String)
    fun setContext(type: MessageType, authCode: String) : String
}