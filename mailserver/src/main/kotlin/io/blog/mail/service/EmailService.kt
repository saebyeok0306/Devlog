package io.blog.mail.service

import io.blog.mail.types.MessageType

interface EmailService {
    fun sendEmail(type: MessageType, email: String, subject: String, authCode: String)
    fun createAuthCode() : String
    fun setContext(type: MessageType, authCode: String) : String
}