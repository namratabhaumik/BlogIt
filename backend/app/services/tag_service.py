from app.mongo import MongoDB
from app.config import Config
from pymongo.errors import PyMongoError


class TagService:
    @staticmethod
    def get_tag_counts():
        try:
            mongo = MongoDB(Config.MONGO_URI, Config.DATABASE_NAME)
            collection = mongo.get_collection('blog_posts')

            # Aggregate tag counts
            try:
                pipeline = [
                    # Deconstructs the tags array field
                    {"$unwind": "$tags"},
                    # Groups by tag and counts occurrences
                    {"$group": {"_id": "$tags", "count": {"$sum": 1}}}
                ]
                result = list(collection.aggregate(pipeline))
            except Exception as e:
                print(f"Error aggregating unique tags: {e}")

            # Transform result into a list of dictionaries
            tags_with_counts = [{"tag": item["_id"],
                                 "count": item["count"]} for item in result]
            return tags_with_counts
        except PyMongoError as e:
            print(f"MongoDB error while fetching tag counts: {e}")
            return []
