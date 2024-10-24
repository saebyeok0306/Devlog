package io.blog.sitemap.service

import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.io.File

@Service
class SitemapServiceImpl(
        @Value("\${sitemap.path}") private val sitemapPath: String,
        private val mainService: MainService
) : SitemapService {

    override fun generateSitemap(): String {
        val site = "https://devlog.run"
        val allPosts = mainService.getAllPosts()

        val sb = StringBuilder()
        sb.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n")
        sb.append("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n\n")
        sb.append("<url><loc>${site}</loc></url>\n")

        for (post in allPosts.posts) {
            sb.append("<url><loc>$site/post/${post["url"]}</loc></url>\n")
        }

        sb.append("</urlset>")
        return sb.toString()
    }

    override fun generateSitemapXml(sitemap: String) : File {
        val file = File(sitemapPath)

        if (!file.parentFile.exists()) {
            file.parentFile.mkdirs()
        }

        file.writeText(sitemap)
        return file
    }
}