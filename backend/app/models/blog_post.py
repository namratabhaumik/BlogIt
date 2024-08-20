# Author - 
# Modified by - Pratik Sakaria (B00954261)
from app.mongo import MongoDB
from app.config import Config
from pymongo.errors import PyMongoError
from datetime import datetime
from datetime import datetime

class BlogPost:
    def __init__(
        self,
        blog_post_id,
        title,
        author,
        tags,
        image_url,
        content,
        community_id,
        timestamp
    ):
        self.blog_post_id = blog_post_id
        self.title = title
        self.author = author
        self.tags = tags
        self.image_url = image_url
        self.content = content
        self.community_id = community_id  # Include community_id
        self.mongo = MongoDB(Config.MONGO_URI, Config.DATABASE_NAME)
        self.community_id = community_id
        self.timestamp = timestamp

    def save(self):
        try:
            collection = self.mongo.get_collection('blog_posts')
            collection.insert_one({
                '_id': self.blog_post_id,
                'title': self.title,
                'author': self.author,
                'tags': self.tags,
                'image_url': self.image_url,
                'content': self.content,
                'community_id': self.community_id,
                'timestamp': self.timestamp,
            })
            print(f"Blog Post {self.title} saved successfully")
        except RuntimeError as e:
            print(f"Error: {e}")
        except PyMongoError as e:
            print(f"MongoDB error while saving blog post: {e}")


    def edit(self, updates):
        try:
            collection = self.mongo.get_collection('blog_posts')
            result = collection.update_one(
                {'_id': self.blog_post_id},
                {'$set': updates}
            )
            if result.matched_count > 0:
                print(f"Blog Post {self.title} updated successfully")
            else:
                print(f"No matching video post found with ID {self.blog_post_id}")
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
            collection = mongo.get_collection("blog_posts")
            doc = collection.find_one(query)
            if doc:
                return convert_blog_post_doc_to_blog_post(doc)
            else:
                return None
        except RuntimeError as e:
            print(f"Error: {e}")
        except PyMongoError as e:
            print(f"MongoDB error while accessing MongoDB: {str(e)}")

    from pymongo import MongoClient, errors

    @staticmethod
    def get_all_posts(community_id=None):
        try:
            mongo = MongoDB(Config.MONGO_URI, Config.DATABASE_NAME)
            collection = mongo.get_collection('blog_posts')

            # Define the query filter
            query = {}
            if community_id:
                query['community_id'] = community_id

            print(f"Querying with filter: {query}")  # Debugging output

            # Retrieve posts based on the query
            posts = list(collection.find(query).sort("timestamp", -1))
            
            # Process and convert timestamps
            
            # Process and convert timestamps
            for post in posts:
                print(f"Retrieved posts: {posts}")  # Debugging output
                if 'timestamp' in post:
                    timestamp = post['timestamp']
                    if isinstance(timestamp, str):
                        post['timestamp'] = timestamp

            print(f"Retrieved posts: {posts}")  # Debugging output
            return posts
        
        
        except RuntimeError as e:
            print(f"Error: {e}")
            return []
        except errors.PyMongoError as e:
            print(f"MongoDB error while retrieving posts: {e}")
            return []

    
    # @staticmethod
    # def get_all_posts():
    #     try:
    #         mongo = MongoDB(Config.MONGO_URI, Config.DATABASE_NAME)
    #         collection = mongo.get_collection('blog_posts')
    #         posts = list(collection.find({}))
    #         posts = [post for post in posts]
    #         return posts
    #     except RuntimeError as e:
    #         print(f"Error: {e}")
    #         return []
    #     except PyMongoError as e:
    #         print(f"MongoDB error while retrieving video post: {e}")
    #         return [] 
    

    @staticmethod
    def get_posts_by_user_id(user_id):
        try:
            mongo = MongoDB(Config.MONGO_URI, Config.DATABASE_NAME)
            collection = mongo.get_collection('blog_posts')
            posts = list(collection.find({'author': user_id}))
            for post in posts:
                post["timestamp"] = post["timestamp"].timestamp()
            posts = [post for post in posts]
            return posts
        except RuntimeError as e:
            print(f"Error: {e}")
            return None
        except PyMongoError as e:
            print(f"MongoDB error while retrieving blog post: {e}")
            return None

    @staticmethod
    def delete_post_by_id(post_id):
        try:
            mongo = MongoDB(Config.MONGO_URI, Config.DATABASE_NAME)
            collection = mongo.get_collection('blog_posts')
            result = collection.delete_one({'_id': post_id})
            return result.deleted_count
        except RuntimeError as e:
            print(f"Error: {e}")
            return 0
        except PyMongoError as e:
            print(f"MongoDB error while deleting blog post: {e}")
            return 0
    
    @staticmethod
    def get_posts_by_community_id(arg_community_id):
        """
        Retrieve blog posts filtered by the given community ID.

        :param arg_community_id: ID of the community to filter posts by
        :returns: List of filtered blog posts belonging to the given community
        :author: Zeel Ravalani
        """
        try:
            print(f"get_posts_by_community_id Model community_id: {arg_community_id}")
            mongo = MongoDB(Config.MONGO_URI, Config.DATABASE_NAME)
            collection = mongo.get_collection('blog_posts')
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
            print(f"MongoDB error while retrieving blog posts: {e}")
            return []

    @staticmethod
    def search(query):
        try:
            mongo = MongoDB(Config.MONGO_URI, Config.DATABASE_NAME)
            collection = mongo.get_collection('blog_posts')
            results = list(collection.find({
                "$or": [
                    {"title": {"$regex": query, "$options": "i"}},
                    {"content": {"$regex": query, "$options": "i"}}
                ]
            }))
            return [convert_blog_post_doc_to_blog_post(result) for result in results]
        except PyMongoError as e:
            print(f"MongoDB error while searching blog posts: {e}")
            return []

def convert_blog_post_doc_to_blog_post(document):
    if document:
        return {
            "blog_post_id": document["_id"],
            "title": document["title"],
            "author": document["author"],
            "tags": document["tags"],
            "image_url": document["image_url"],
            "content": document["content"],
            "community_id": document["community_id"],
            "timestamp": document["timestamp"]
        }
    else:
        return None