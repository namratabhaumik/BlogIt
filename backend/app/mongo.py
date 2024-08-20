from pymongo import MongoClient
from pymongo.errors import ConfigurationError, PyMongoError

"""
A singleton class to connect to the MongoDB database
"""
class Singleton(type):
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super(Singleton, cls).__call__(*args, **kwargs)
        return cls._instances[cls]

class MongoDB(metaclass=Singleton):
    def __init__(self, uri, database_name):
        try:
            self.client = MongoClient(uri)
            self.db = self.client[database_name]
        except ConfigurationError as e:
            print(f"Failed to connect to MongoDB: {e}")
            self.client = None
            self.db = None
        except PyMongoError as e:
            print(f"MongoDB error: {e}")
            self.client = None
            self.db = None
    
    def get_collection(self, collection_name):
        return self.db[collection_name]
