package io.blog.sitemap.service

import io.blog.sitemap.dto.PostsResponse

interface MainService {
    fun getAllPosts() : PostsResponse
}