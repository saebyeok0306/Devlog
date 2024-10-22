package io.blog.sitemap.controller

import io.blog.sitemap.service.SitemapService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class SitemapController(private val sitemapService: SitemapService) {

    @GetMapping("/sitemap")
    fun generateSitemap() : ResponseEntity<String> {
        val generateSitemap = sitemapService.generateSitemap()
        println("Sitemap generated: $generateSitemap")
        return ResponseEntity.ok(generateSitemap)
    }
}