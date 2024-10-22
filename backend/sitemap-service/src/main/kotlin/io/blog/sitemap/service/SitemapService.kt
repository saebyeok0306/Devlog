package io.blog.sitemap.service

import java.io.File

interface SitemapService {
    fun generateSitemap() : String
    fun generateSitemapXml(sitemap: String) : File
}