from datetime import datetime
from app.mongo import MongoDB
from app.config import Config
from pymongo.errors import PyMongoError

class User:
    def __init__(
        self,
        user_id,
        username,
        email,
        name,
        web_url,
        location,
        bio,
        pronouns,
        education,
        work_status,
        profile_pic,
        profile_banner,
        join_date
    ):
        self.user_id = user_id
        self.username = username
        self.email = email
        self.name = name
        self.web_url = web_url
        self.location = location
        self.bio = bio
        self.pronouns = pronouns
        self.education = education
        self.work_status = work_status
        self.profile_pic = profile_pic
        self.profile_banner = profile_banner
        self.join_date = join_date
        self.mongo = MongoDB(Config.MONGO_URI, Config.DATABASE_NAME)

    def save(self):
        try:
            collection = self.mongo.get_collection('users')
            collection.insert_one({
                '_id': self.user_id,
                'username': self.username,
                'email': self.email,
                'name': self.name,
                'web_url': self.web_url,
                'location': self.location,
                'bio': self.bio,
                'pronouns': self.pronouns,
                'education': self.education,
                'work_status': self.work_status,
                'profile_pic': self.profile_pic,
                'profile_banner': self.profile_banner,
                'join_date': datetime.utcfromtimestamp(self.join_date)
            })
            print(f"User {self.username} saved successfully")
        except RuntimeError as e:
            print(f"Error: {e}")
        except PyMongoError as e:
            print(f"MongoDB error while saving user: {e}")

    @staticmethod
    def get_user_by_username(username):
        query = { "username": username }
        try:
            mongo = MongoDB(Config.MONGO_URI, Config.DATABASE_NAME)
            collection = mongo.get_collection("users")
            doc = collection.find_one(query)
            if doc:
                return convert_user_doc_to_user(doc)
            else:
                return None
        except RuntimeError as e:
            print(f"Error: {e}")
        except PyMongoError as e:
            print(f"MongoDB error while accessing MongoDB: {str(e)}")

    @staticmethod
    def get_all_users():
        try:
            mongo = MongoDB(Config.MONGO_URI, Config.DATABASE_NAME)
            collection = mongo.get_collection('users')
            users = list(collection.find({}))
            users = [user for user in users]
            return users
        except RuntimeError as e:
            print(f"Error: {e}")
            return []
        except PyMongoError as e:
            print(f"MongoDB error while retrieving users: {e}")
            return []

    @staticmethod
    def get_user_by_id(user_id):
        try:
            mongo = MongoDB(Config.MONGO_URI, Config.DATABASE_NAME)
            collection = mongo.get_collection('users')
            user = collection.find_one({'_id': user_id})
            return convert_user_doc_to_user(user)
        except RuntimeError as e:
            print(f"Error: {e}")
            return None
        except PyMongoError as e:
            print(f"MongoDB error while retrieving user: {e}")
            return None

    @staticmethod
    def delete_user_by_id(user_id):
        try:
            mongo = MongoDB(Config.MONGO_URI, Config.DATABASE_NAME)
            collection = mongo.get_collection('users')
            result = collection.delete_one({'_id': user_id})
            return result.deleted_count
        except RuntimeError as e:
            print(f"Error: {e}")
            return 0
        except PyMongoError as e:
            print(f"MongoDB error while deleting user: {e}")
            return 0
    
    @staticmethod
    def update_user_by_id(user_id, user_attr):
        try:
            mongo = MongoDB(Config.MONGO_URI, Config.DATABASE_NAME)
            collection = mongo.get_collection('users')
            result = collection.update_one(
                {'_id': user_id},
                {"$set" : user_attr}
            )
            return result.matched_count
        except RuntimeError as e:
            print(f"Error: {e}")
            return 0
        except PyMongoError as e:
            print(f"MongoDB error while deleting user: {e}")
            return 0

    def to_dict(self):
        return {
            "id": self.user_id,
            "username": self.username,
            "email": self.email,
            "name": self.name,
            "web_url": self.web_url,
            "location": self.location,
            "bio": self.bio,
            "pronouns": self.pronouns,
            "education": self.education,
            "work_status": self.work_status,
            "profile_pic": self.profile_pic,
            "profile_banner": self.profile_banner,
            "join_date": self.join_date.timestamp()
        }

    @staticmethod
    def get_users_by_ids(user_ids):
        try:
            print(f"Fetching users with IDs: {user_ids}")
            mongo = MongoDB(Config.MONGO_URI, Config.DATABASE_NAME)
            collection = mongo.get_collection('users')
            
            query = {'_id': {'$in': user_ids}}
            user_docs = collection.find(query)
            
            users = [convert_user_doc_to_user(doc) for doc in user_docs]
            # print(f"Users fetched: {users}")
            
            return users
        except RuntimeError as e:
            print(f"Error: {e}")
            return []
        except PyMongoError as e:
            print(f"MongoDB error while retrieving users: {e}")
            return []

    def to_dict(self):
        return {
            "id": self.user_id,
            "username": self.username,
            "email": self.email,
            "name": self.name,
            "web_url": self.web_url,
            "location": self.location,
            "bio": self.bio,
            "pronouns": self.pronouns,
            "education": self.education,
            "work_status": self.work_status,
            "profile_pic": self.profile_pic,
            "profile_banner": self.profile_banner,
            "join_date": self.join_date.timestamp()
        }

def convert_user_doc_to_user(document):
    if document:
        return User(
            document["_id"],
            document["username"],
            document["email"],
            document["name"],
            document["web_url"],
            document["location"],
            document["bio"],
            document["pronouns"],
            document["education"],
            document["work_status"],
            document["profile_pic"],
            document["profile_banner"],
            document["join_date"]
        )
    else:
        return None