package io.blog.sitemap.scheduler

import io.blog.sitemap.service.SitemapService
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component

@Component
class SitemapScheduler(
        private val sitemapService: SitemapService,
) {
    // TODO: 나중에는 게시글 생성, 수정, 삭제, 카테고리 수정시 사이트맵 관리을 관리하도록 변경하기
    // 초 분 시 일 월 요일
    @Scheduled(cron = "0 0 0 * * ?")
    fun generateSitemap() {
        println("Generating sitemap")

        val generateSitemap = sitemapService.generateSitemap()
        val file = sitemapService.generateSitemapXml(generateSitemap)

        println("Sitemap generated ${file.absolutePath}")
    }
}