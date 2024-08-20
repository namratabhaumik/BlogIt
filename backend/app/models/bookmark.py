# Author - Namrata Bhaumik (B00957053)
from pymongo.errors import PyMongoError
from app.mongo import MongoDB
from app.config import Config
from datetime import datetime
from app.models.blog_post import BlogPost


class Bookmark:
    def __init__(self, user_id, post_id, timestamp=None):
        self.user_id = user_id
        self.post_id = post_id
        self.mongo = MongoDB(Config.MONGO_URI, Config.DATABASE_NAME)
        self.timestamp = timestamp or datetime.now().isoformat()

    def save(self):
        try:
            collection = self.mongo.get_collection('bookmark')
            bookmark_id = f"{self.post_id}_{self.user_id}"
            bookmark = {
                '_id': bookmark_id,
                'user_id': self.user_id,
                'post_id': self.post_id,
                'timestamp': self.timestamp,
            }
            # Check if bookmark already exists
            try:
                existing = collection.find_one({'_id': bookmark_id})
                print(existing)
            except Exception as e:
                print('ERROR ')
                print(e)
            if existing:
                return {"result": "Bookmark already exists"}

            # Insert new bookmark
            result = collection.insert_one(bookmark)
            return {"result": "success", "id": str(result.inserted_id)}
        except RuntimeError as e:
            print(f"Error: {e}")
            return {"result": "Runtime error"}
        except PyMongoError as e:
            print(f"MongoDB error while saving bookmark: {e}")
            return {"result": "MongoDB error"}

    @staticmethod
    def delete(user_id, post_id):
        try:
            mongo = MongoDB(Config.MONGO_URI, Config.DATABASE_NAME)
            collection = mongo.get_collection('bookmark')
            bookmark_id = f"{post_id}_{user_id}"
            bookmark = {
                '_id': bookmark_id,
                'user_id': user_id,
                'post_id': post_id
            }
            result = collection.delete_one({'_id': bookmark_id})
            if result.deleted_count == 0:
                return {"result": "Bookmark not found"}
            return {"result": "success", "deleted_count": result.deleted_count}
        except RuntimeError as e:
            print(f"Error: {e}")
            return {"result": "Runtime error"}
        except PyMongoError as e:
            print(f"MongoDB error while deleting bookmark: {e}")
            return {"result": "MongoDB error"}

    @staticmethod
    def get_user_bookmarks(user_id):
        try:
            mongo = MongoDB(Config.MONGO_URI, Config.DATABASE_NAME)
            collection = mongo.get_collection('bookmark')
            bookmarks = collection.find({'user_id': user_id})
            bookmarks_list = []
            for bookmark in bookmarks:
                bookmarks_list.append({
                    'post_id': bookmark['post_id'],
                    'user_id': bookmark['user_id']
                })
            return {"result": "success", "bookmarks": bookmarks_list}
        except RuntimeError as e:
            print(f"Error: {e}")
            return {"result": "Runtime error"}
        except PyMongoError as e:
            print(f"MongoDB error while fetching bookmarks: {e}")
            return {"result": "MongoDB error"}

    @staticmethod
    def get_bookmarks_by_community_id(community_id):
        """
        Retrieve bookmarks for a given community by fetching associated post IDs and querying the bookmarks collection.

        :param community_id: ID of the community to filter bookmarks by
        :returns: List of bookmarks associated with the given community
        :author: Zeel Ravalani
        """
        try:
            print(f"get_bookmarks_by_community_id Model community_id: {community_id}")
            # Use BlogPost's method to get posts by community_id
            posts = BlogPost.get_posts_by_community_id(community_id)
            post_ids = [post['_id'] for post in posts]
            print(f"post_ids: {post_ids}")

            # Retrieve bookmarks for these post_ids
            mongo = MongoDB(Config.MONGO_URI, Config.DATABASE_NAME)
            collection = mongo.get_collection('bookmark')
            bookmarks = collection.find({'post_id': {'$in': post_ids}})
            
            # Fetch all bookmark data as is
            bookmarks_list = [bookmark for bookmark in bookmarks]
            
            print(f"bookmarks_list: {bookmarks_list}")

            return bookmarks_list
        except RuntimeError as e:
            print(f"Error: {e}")
            return {"result": "Runtime error"}
        except PyMongoError as e:
            print(f"MongoDB error while fetching bookmarks by community: {e}")
            return {"result": "MongoDB error"}

