# Author - Zeel Ravalani (B00917373)
from datetime import datetime
from app.mongo import MongoDB
from app.config import Config
from pymongo.errors import PyMongoError

class Follow:
    def __init__(self, follower_id, following_id):
        self.follower_id = follower_id
        self.following_id = following_id
        self.mongo = MongoDB(Config.MONGO_URI, Config.DATABASE_NAME)

    def save(self):
        try:
            collection = self.mongo.get_collection('follows')
            collection.insert_one({
                'follower_id': self.follower_id,
                'following_id': self.following_id,
                'timestamp': datetime.utcnow()
            })
            print(f"Follow relationship saved: {self.follower_id} follows {self.following_id}")
        except RuntimeError as e:
            print(f"Error: {e}")
        except PyMongoError as e:
            print(f"MongoDB error while saving follow relationship: {e}")

    @staticmethod
    def get_followers(user_id):
        try:
            mongo = MongoDB(Config.MONGO_URI, Config.DATABASE_NAME)
            collection = mongo.get_collection('follows')
            followers = collection.find({'following_id': user_id})
            follower_ids = [follower['follower_id'] for follower in followers]
            return follower_ids
        except RuntimeError as e:
            print(f"Error: {e}")
            return []
        except PyMongoError as e:
            print(f"MongoDB error while fetching followers: {e}")
            return []

    @staticmethod
    def get_following(user_id):
        try:
            mongo = MongoDB(Config.MONGO_URI, Config.DATABASE_NAME)
            collection = mongo.get_collection('follows')
            following = collection.find({'follower_id': user_id})
            following_ids = [follow['following_id'] for follow in following]
            return following_ids
        except RuntimeError as e:
            print(f"Error: {e}")
            return []
        except PyMongoError as e:
            print(f"MongoDB error while fetching following users: {e}")
            return []

    # @staticmethod
    # def get_followers_with_details(user_id):
    #     follower_ids = Follow.get_followers(user_id)
    #     return User.get_users_by_ids(follower_ids)

    # @staticmethod
    # def get_following_with_details(user_id):
    #     following_ids = Follow.get_following(user_id)
    #     return User.get_users_by_ids(following_ids)


    @staticmethod
    def remove_follower(follower_id, following_id):
        try:
            mongo = MongoDB(Config.MONGO_URI, Config.DATABASE_NAME)
            collection = mongo.get_collection('follows')
            result = collection.delete_one({'follower_id': follower_id, 'following_id': following_id})
            return result.deleted_count > 0
        except PyMongoError as e:
            print(f"MongoDB error while removing follow relationship: {e}")
            return False