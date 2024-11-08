package io.blog.sitemap.service

import com.fasterxml.jackson.databind.util.JSONPObject
import io.blog.sitemap.dto.PostUrlDto
import org.apache.tomcat.util.json.JSONParser
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.io.File
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
import java.nio.file.StandardOpenOption

@Service
class SitemapServiceImpl(
        @Value("\${sitemap.path}") private val sitemapPath: String,
        @Value("\${sitemap.resource.path}") private val sitemapResourcePath: String,
        private val mainService: MainService
) : SitemapService {

    val siteUrl : String = "https://devlog.run"

    override fun generateSitemap(): String {
        val sb = StringBuilder()
        sb.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n")
        sb.append("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n\n")
        sb.append("<url><loc>${siteUrl}</loc></url>\n")

        val location = this.getFolder(sitemapResourcePath)
        for (subSitemap in location.toFile().listFiles()) {
            for (line in subSitemap.readLines()) {
                sb.append("<url><loc>$line</loc></url>\n")
            }
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

    override fun addPostToSubSitemap(postUrlDto: PostUrlDto) {
        val location = this.getFolder(sitemapResourcePath)
        val subSitemapFile = this.getSubSitemap(location, postUrlDto.categoryId)

        val url = this.getSitemapUrl(postUrlDto.url)

        for (line in Files.readAllLines(subSitemapFile)) {
            if (line.equals(url)) {
                return
            }
        }
        Files.write(subSitemapFile, "$url\n".toByteArray(), StandardOpenOption.APPEND)

        val generateSitemap = this.generateSitemap()
        this.generateSitemapXml(generateSitemap)
    }

    override fun deletePostFromSubSitemap(postUrlDto: PostUrlDto) {
        val location = this.getFolder(sitemapResourcePath)
        val subSitemapFile = this.getSubSitemap(location, postUrlDto.categoryId)

        val url = this.getSitemapUrl(postUrlDto.url)

        Files.newBufferedReader(subSitemapFile).use { reader ->
            val lines : List<String> = reader.readLines()
            val newLines = lines.filter { it != url }

            println("Lines: $newLines")
            println("New Lines: $newLines")

            if (newLines.isEmpty()) {
                Files.delete(subSitemapFile)
            } else {
                Files.write(subSitemapFile, newLines)
            }
        }

        val generateSitemap = this.generateSitemap()
        this.generateSitemapXml(generateSitemap)
    }

    override fun createAllPostToSubSitemap() {
        val allPosts = mainService.getAllPosts()

        for (post in allPosts.posts) {
            val postUrlDto = PostUrlDto(post.category.id, post.url)
            this.addPostToSubSitemap(postUrlDto)
        }
    }

    fun getFolder(location: String) : Path {
        val path = Paths.get(location)
        if (!Files.exists(path)) {
            Files.createDirectories(path)
        }
        return path
    }

    fun getSubSitemap(directoryPath : Path, categoryId: Long) : Path {
        val subSitemapFile = directoryPath.resolve("sub_sitemap_$categoryId.xml")

        if (!Files.exists(subSitemapFile)) {
            Files.createFile(subSitemapFile)
        }
        return subSitemapFile
    }

    fun getSitemapUrl(url: String) : String {
        return "${siteUrl}/post/$url"
    }
}