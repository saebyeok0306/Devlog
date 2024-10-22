package io.blog.sitemap.dto

data class PostsResponse(
        val posts: ArrayList<Map<String, Any>>,
        val totalPages: Int,
        val currentPage: Int,
        val totalElements: Long
)
