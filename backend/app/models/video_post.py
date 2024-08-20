from app.mongo import MongoDB
from app.config import Config
from pymongo.errors import PyMongoError
from datetime import datetime, timezone

class VideoPost:
    def __init__(
        self,
        video_post_id,
        video_url,
        title,
        author,
        tags,
        time,
        thumbnail_url,
        content,
        community_id
    ):
        self.video_post_id = video_post_id
        self.video_url = video_url
        self.title = title
        self.author = author
        self.tags = tags
        self.time = time
        self.thumbnail_url = thumbnail_url
        self.content = content
        self.mongo = MongoDB(Config.MONGO_URI, Config.DATABASE_NAME)
        self.community_id = community_id
        
    def save(self):
        try:
            collection = self.mongo.get_collection('video_posts')
            collection.insert_one({
                '_id': self.video_post_id,
                'video_url': self.video_url,
                'title': self.title,
                'author': self.author,
                'tags': self.tags,
                'time': self.time,
                'thumbnail_url': self.thumbnail_url,
                'content': self.content,
                'community_id': self.community_id,
                'timestamp': datetime.now(timezone.utc),
            })
            print(f"Video Post {self.title} saved successfully")
        except RuntimeError as e:
            print(f"Error: {e}")
        except PyMongoError as e:
            print(f"MongoDB error while saving video post: {e}")

    def edit(self, updates):
        try:
            collection = self.mongo.get_collection('video_posts')
            result = collection.update_one(
                {'_id': self.video_post_id},
                {'$set': updates}
            )
            if result.matched_count > 0:
                print(f"Video Post {self.title} updated successfully")
            else:
                print(f"No matching video post found with ID {self.video_post_id}")
        except RuntimeError as e:
            print(f"Error: {e}")
        except PyMongoError as e:
            print(f"MongoDB error while updating video post: {e}")

    @staticmethod
    def get_post_by_id(id):
        query = {"_id": int(id)}
        print(query)
        try:
            mongo = MongoDB(Config.MONGO_URI, Config.DATABASE_NAME)
            collection = mongo.get_collection("video_posts")
            doc = collection.find_one(query)
            if doc:
                return convert_video_post_doc_to_video_post(doc)
            else:
                return None
        except RuntimeError as e:
            print(f"Error: {e}")
        except PyMongoError as e:
            print(f"MongoDB error while accessing MongoDB: {str(e)}")

    @staticmethod
    def get_all_posts():
        try:
            mongo = MongoDB(Config.MONGO_URI, Config.DATABASE_NAME)
            collection = mongo.get_collection('video_posts')
            posts = list(collection.find({}))
            # Process and convert timestamps
            for post in posts:
                if 'timestamp' in post:
                    timestamp = post['timestamp']
                    if isinstance(timestamp, str):
                        post['timestamp'] = timestamp
                        
            posts = [post for post in posts]
            return posts
        except RuntimeError as e:
            print(f"Error: {e}")
            return []
        except PyMongoError as e:
            print(f"MongoDB error while retrieving video post: {e}")
            return []

    @staticmethod
    def get_posts_by_user_id(user_id):
        try:
            mongo = MongoDB(Config.MONGO_URI, Config.DATABASE_NAME)
            collection = mongo.get_collection('video_posts')
            posts = list(collection.find({'author': user_id}))
            for post in posts:
                post["timestamp"] = post["timestamp"].timestamp()
            posts = [post for post in posts]
            return posts
        except RuntimeError as e:
            print(f"Error: {e}")
            return None
        except PyMongoError as e:
            print(f"MongoDB error while retrieving video post: {e}")
            return None

    @staticmethod
    def delete_post_by_id(post_id):
        try:
            mongo = MongoDB(Config.MONGO_URI, Config.DATABASE_NAME)
            collection = mongo.get_collection('video_posts')
            result = collection.delete_one({'_id': post_id})
            return result.deleted_count
        except RuntimeError as e:
            print(f"Error: {e}")
            return 0
        except PyMongoError as e:
            print(f"MongoDB error while deleting video post: {e}")
            return 0

    @staticmethod
    def get_video_posts_by_community_id(arg_community_id):
        """
        Retrieve video posts for a given community ID from the database.

        :param arg_community_id: ID of the community to filter video posts by
        :returns: List of video posts associated with the given community
        :author: Zeel Ravalani
        """
        try:
            print(f"get_video_posts_by_community_id Model community_id: {arg_community_id}")
            mongo = MongoDB(Config.MONGO_URI, Config.DATABASE_NAME)
            collection = mongo.get_collection('video_posts')
            # print(f"collection Model: {collection}")
            posts = list(collection.find({}))
            # print(f"All posts fetched: {posts}")
            
            # Filter posts by community_id
            filtered_posts = [post for post in posts if post.get('community_id') == arg_community_id]
            # print(f"Filtered posts Model: {filtered_posts}")
            
            return filtered_posts
        except RuntimeError as e:
            print(f"Error: {e}")
            return []
        except PyMongoError as e:
            print(f"MongoDB error while retrieving video posts: {e}")
            return []


def convert_video_post_doc_to_video_post(document):
    if document:
        return {
            "video_post_id": document["_id"],
            "video_url": document["video_url"],
            "title": document["title"],
            "author": document["author"],
            "tags": document["tags"],
            "time": document["time"],
            "thumbnail_url": document["thumbnail_url"],
            "content": document["content"],
            "timestamp": document["timestamp"].timestamp(),
            "community_id": document["community_id"]
        }
    else:
        return None