# Author - Namrata Bhaumik (B00957053)
from app.models.bookmark import Bookmark
from app.models.blog_post import BlogPost


class BookmarkService:
    @staticmethod
    def add_bookmark(user_id, post_id):
        bookmark = Bookmark(user_id, post_id)
        response = bookmark.save()
        if response["result"] == "success":
            return {"success": True, "message": "Bookmark added successfully."}
        elif response["result"] == "Bookmark already exists":
            return {"success": False, "message": response["result"]}
        return {"success": False, "message": response["result"]}

    @staticmethod
    def remove_bookmark(user_id, post_id):
        response = Bookmark.delete(user_id, post_id)
        if response["result"] == "success":
            return {"success": True, "message": "Bookmark removed successfully."}
        return {"success": False, "message": response["result"]}

    @staticmethod
    def get_user_bookmarks(user_id):
        bookmarks_response = Bookmark.get_user_bookmarks(user_id)
        if bookmarks_response["result"] == "success":
            bookmarks = bookmarks_response["bookmarks"]
            full_posts = []
            for bookmark in bookmarks:
                post_id = bookmark['post_id']
                post_details = BlogPost.get_post_by_id(post_id)
                if post_details:
                    full_posts.append(post_details)
            return {"success": True, "bookmarks": full_posts}
        return {"success": False, "message": bookmarks_response["result"]}
