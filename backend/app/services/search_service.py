# Author - Pratik Sakaria (B00954261)
from app.models.blog_post import BlogPost
from app.models.community import Community

class SearchService:
    @staticmethod
    def search_site(query):
        # Search in BlogPosts
        blog_results = BlogPost.search(query)
        # Search in Communities
        community_results = Community.search(query)

        return {
            "blog_posts": blog_results,
            "communities": community_results
        }
