package io.blog.mail.redis.config

import io.blog.mail.redis.service.VerifyEmailSubService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.redis.connection.RedisConnectionFactory
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory
import org.springframework.data.redis.listener.ChannelTopic
import org.springframework.data.redis.listener.RedisMessageListenerContainer
import org.springframework.data.redis.listener.adapter.MessageListenerAdapter


// Subscriber
@Configuration
class RedisConfig {
    @Autowired
    private lateinit var verifyEmailSubService: VerifyEmailSubService

    @Value("\${spring.data.redis.host}")
    var redisHost: String = "localhost"
    @Value("\${spring.data.redis.port:6379}")
    var redisPort: Int = 6379

    @Bean
    fun redisConnectionFactory(): RedisConnectionFactory {
        println("Redis host: $redisHost")
        println("Redis port: $redisPort")
        return LettuceConnectionFactory(redisHost, redisPort)
    }

    @Bean
    fun verifyEmailMessageListenerAdapter(): MessageListenerAdapter {
        return MessageListenerAdapter(verifyEmailSubService)
    }

    @Bean
    fun redisContainer(): RedisMessageListenerContainer {
        val container = RedisMessageListenerContainer()
        container.setConnectionFactory(redisConnectionFactory())
        container.addMessageListener(verifyEmailMessageListenerAdapter(), verifyEmailTopic())
        return container
    }

    @Bean
    fun verifyEmailTopic(): ChannelTopic {
        return ChannelTopic("VerifyEmail")
    }
}