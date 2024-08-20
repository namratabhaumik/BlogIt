# Author - Pratik Sakaria (B00954261)
from datetime import datetime
from app.mongo import MongoDB
from app.config import Config
from pymongo.errors import PyMongoError
from bson import ObjectId

class Community:
    def __init__(
        self,
        community_id,
        community_name,
        community_desc,
        community_members_list,
        admin,
        created_date=None
    ):
        self.community_id = community_id
        self.community_name = community_name
        self.community_desc = community_desc
        self.community_members_list = community_members_list
        self.admin = admin
        self.created_date = created_date or datetime.utcnow()
        self.mongo = MongoDB(Config.MONGO_URI, Config.DATABASE_NAME)

    def save(self):
        try:
            collection = self.mongo.get_collection('communities')
            collection.insert_one({
                '_id': self.community_id,  # Use community_id as _id in MongoDB
                'community_name': self.community_name,
                'community_desc': self.community_desc,
                'community_members_list': self.community_members_list,
                'admin': self.admin,
                'created_date': self.created_date
            })
            print(f"Community {self.community_name} saved successfully")
        except RuntimeError as e:
            print(f"Error: {e}")
        except PyMongoError as e:
            print(f"MongoDB error while saving community: {e}")

    @staticmethod
    def get_community_by_id(community_id):
        try:
            mongo = MongoDB(Config.MONGO_URI, Config.DATABASE_NAME)
            collection = mongo.get_collection('communities')
            community = collection.find_one({'_id': community_id})
            return convert_community_doc_to_community(community)
        except RuntimeError as e:
            print(f"Error: {e}")
            return None
        except PyMongoError as e:
            print(f"MongoDB error while retrieving community: {e}")
            return None

    @staticmethod
    def get_all_communities():
        try:
            mongo = MongoDB(Config.MONGO_URI, Config.DATABASE_NAME)
            collection = mongo.get_collection('communities')
            communities = list(collection.find({}))
            return [convert_community_doc_to_community(community) for community in communities]
        except RuntimeError as e:
            print(f"Error: {e}")
            return []
        except PyMongoError as e:
            print(f"MongoDB error while retrieving communities: {e}")
            return []

    @staticmethod
    def delete_community_by_id(community_id):
        try:
            mongo = MongoDB(Config.MONGO_URI, Config.DATABASE_NAME)
            collection = mongo.get_collection('communities')
            result = collection.delete_one({'_id': community_id})
            return result.deleted_count
        except RuntimeError as e:
            print(f"Error: {e}")
            return 0
        except PyMongoError as e:
            print(f"MongoDB error while deleting community: {e}")
            return 0
    
    @staticmethod
    def update_community_by_id(community_id, community_attr):
        try:
            mongo = MongoDB(Config.MONGO_URI, Config.DATABASE_NAME)
            collection = mongo.get_collection('communities')
            result = collection.update_one(
                {'_id': community_id},
                {"$set" : community_attr}
            )
            return result.matched_count
        except RuntimeError as e:
            print(f"Error: {e}")
            return 0
        except PyMongoError as e:
            print(f"MongoDB error while updating community: {e}")
            return 0

    def to_dict(self):
        return {
            '_id': str(self.community_id),  # Ensure community_id is used
            'community_name': self.community_name,
            'community_desc': self.community_desc,
            'community_members_list': self.community_members_list,
            'admin': self.admin,
            'created_date': self.created_date.isoformat() if self.created_date else None,
        }

    @staticmethod
    def get_communities_by_user(user_id):
        mongo = MongoDB(Config.MONGO_URI, Config.DATABASE_NAME)
        collection = mongo.get_collection('communities')
        # Find communities where user_id is in community_members_list or is the admin
        user_communities = collection.find({
            '$or': [
                {'community_members_list': user_id},
                {'admin': user_id}
            ]
        })
        return list(user_communities)

    @staticmethod
    def search(query):
        try:
            mongo = MongoDB(Config.MONGO_URI, Config.DATABASE_NAME)
            collection = mongo.get_collection('communities')
            results = list(collection.find({
                "community_name": {"$regex": query, "$options": "i"}
            }))
            return [convert_community_doc_to_community(result).to_dict() for result in results]
        except PyMongoError as e:
            print(f"MongoDB error while searching communities: {e}")
            return []

            
def convert_community_doc_to_community(document):
    if document:
        return Community(
            document["_id"],
            document["community_name"],
            document["community_desc"],
            document["community_members_list"],
            document["admin"],
            document["created_date"]
        )
    else:
        return None
