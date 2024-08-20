"""
Author: MD Samshad Rahman
"""

from app.mongo import MongoDB
from app.config import Config
from pymongo.errors import PyMongoError
from datetime import datetime
from bson.objectid import ObjectId


class Comment:
    # Vote response codes
    VOTE_SUCCESS = "VOTE_SUCCESS"
    ALREADY_UPVOTED = "ALREADY_UPVOTED"
    ALREADY_DOWNVOTED = "ALREADY_DOWNVOTED"
    VOTE_FAILED = "VOTE_FAILED"

    def __init__(self, post_id, user_id, content, is_video=False, parent_id=None, created_at=None, updated_at=None,
                 upvotes=None, downvotes=None, replies=None, comment_id=None):
        """
        Initializes a Comment instance.

        Args:
            post_id (str): The ID of the post this comment belongs to.
            user_id (str): The ID of the user who made the comment.
            content (str): The content of the comment.
            parent_id (str, optional): The ID of the parent comment, if this is a reply.
            created_at (datetime, optional): The creation time of the comment.
            updated_at (datetime, optional): The last updated time of the comment.
            upvotes (list, optional): List of user IDs who upvoted this comment.
            downvotes (list, optional): List of user IDs who downvoted this comment.
            replies (list, optional): List of replies to this comment.
            comment_id (str, optional): The ID of the comment.
        """
        self.comment_id = comment_id if comment_id else None
        self.post_id = str(post_id)
        self.user_id = user_id
        self.parent_id = parent_id
        self.content = content
        self.created_at = created_at if created_at else datetime.utcnow()
        self.updated_at = updated_at if updated_at else datetime.utcnow()
        self.upvotes = upvotes if upvotes else []
        self.downvotes = downvotes if downvotes else []
        self.replies = replies if replies else []
        self.is_video = is_video

        # Initialize MongoDB connection
        self.mongo = MongoDB(Config.MONGO_URI, Config.DATABASE_NAME)

    def save(self):
        """
        Saves the comment to the database.
        """
        try:
            collection = self.mongo.get_collection('comments')
            comment_data = {
                'post_id': self.post_id,
                'user_id': self.user_id,
                'content': self.content,
                'parent_id': self.parent_id,
                'created_at': self.created_at,
                'updated_at': self.updated_at,
                'upvotes': self.upvotes,
                'downvotes': self.downvotes,
                'replies': self.replies,
                'is_video': self.is_video
            }
            result = collection.insert_one(comment_data)
            self.comment_id = str(result.inserted_id)
            print(f"Comment saved successfully with ID {self.comment_id}")
        except PyMongoError as e:
            print(f"MongoDB error while saving comment: {e}")

    def update(self, updates):
        """
        Updates the comment with the provided updates.

        Args:
            updates (dict): A dictionary containing the fields to update.
        """
        try:
            collection = self.mongo.get_collection('comments')
            result = collection.update_one(
                {'_id': ObjectId(self.comment_id), 'user_id': self.user_id},
                {'$set': updates}
            )
            if result.matched_count > 0:
                print(f"Comment updated successfully")
                return True
            else:
                print(f"No matching comment found with ID {self.comment_id} and User ID {self.user_id}")
                return False
        except PyMongoError as e:
            print(f"MongoDB error while updating comment: {e}")
            return False

    @staticmethod
    def get_by_id(comment_id):
        """
        Retrieves a comment by its ID.

        Args:
            comment_id (str): The ID of the comment to retrieve.

        Returns:
            dict or None: The comment data or None if not found.
        """
        try:
            mongo = MongoDB(Config.MONGO_URI, Config.DATABASE_NAME)
            collection = mongo.get_collection('comments')
            doc = collection.find_one({'_id': ObjectId(comment_id)})
            return convert_comment_doc_to_comment(doc) if doc else None
        except PyMongoError as e:
            print(f"MongoDB error while accessing MongoDB: {str(e)}")
            return None

    @staticmethod
    def get_by_post_id(post_id, is_video):
        """
        Retrieves comments for a specific post.

        Args:
            post_id (str): The ID of the post.
            is_video (bool): Indicates if the post is video or not.

        Returns:
            list: A list of comments for the post.
        """
        try:
            mongo = MongoDB(Config.MONGO_URI, Config.DATABASE_NAME)
            collection = mongo.get_collection('comments')
            comments = list(collection.find(
                {'post_id': post_id, 'parent_id': None, 'is_video': is_video}).sort('created_at', -1))
            for comment in comments:
                comment['replies'] = Comment.get_replies(comment['_id'])
            return [convert_comment_doc_to_comment(comment, convert_vote_count=True) for comment in comments]
        except PyMongoError as e:
            print(f"MongoDB error while retrieving comments: {e}")
            return []

    @staticmethod
    def delete_by_id(comment_id, user_id):
        """
        Deletes a comment by its ID and the user ID.

        Args:
            comment_id (str): The ID of the comment to delete.
            user_id (str): The ID of the user requesting the deletion.

        Returns:
            int: The number of deleted comments (1 if successful, 0 otherwise).
        """
        try:
            mongo = MongoDB(Config.MONGO_URI, Config.DATABASE_NAME)
            collection = mongo.get_collection('comments')
            result = collection.delete_one({'_id': ObjectId(comment_id), 'user_id': user_id})
            return result.deleted_count
        except PyMongoError as e:
            print(f"MongoDB error while deleting comment: {e}")
            return 0

    def add_vote(self, user_id, vote_type):
        """
        Adds an upvote or downvote to the comment.

        Args:
            user_id (str): The ID of the user voting.
            vote_type (str): The type of vote ('upvote' or 'downvote').

        Returns:
            str: A response code indicating the result of the operation.
        """
        try:
            collection = self.mongo.get_collection('comments')

            if vote_type == 'upvote':
                if user_id in self.upvotes:
                    return self.ALREADY_UPVOTED
                collection.update_one(
                    {'_id': ObjectId(self.comment_id)},
                    {'$addToSet': {'upvotes': user_id}, '$pull': {'downvotes': user_id}}
                )
            elif vote_type == 'downvote':
                if user_id in self.downvotes:
                    return self.ALREADY_DOWNVOTED
                collection.update_one(
                    {'_id': ObjectId(self.comment_id)},
                    {'$addToSet': {'downvotes': user_id}, '$pull': {'upvotes': user_id}}
                )
            return self.VOTE_SUCCESS
        except PyMongoError as e:
            print(f"MongoDB error while voting on comment: {e}")
            return self.VOTE_FAILED

    @staticmethod
    def get_replies(comment_id):
        """
        Retrieves replies for a specific comment.

        Args:
            comment_id (str): The ID of the comment to retrieve replies for.

        Returns:
            list: A list of replies to the comment.
        """
        try:
            mongo = MongoDB(Config.MONGO_URI, Config.DATABASE_NAME)
            collection = mongo.get_collection('comments')
            replies = list(collection.find({'parent_id': str(comment_id)}).sort('created_at', -1))
            for reply in replies:
                reply['replies'] = Comment.get_replies(reply['_id'])
            return [convert_comment_doc_to_comment(reply, convert_vote_count=True) for reply in replies]
        except PyMongoError as e:
            print(f"MongoDB error while retrieving replies: {e}")
            return []

    def add_reply(self, user_id, content, parent_comment_id):
        """
        Adds a reply to the comment.

        Args:
            user_id (str): The ID of the user replying.
            content (str): The content of the reply.
            parent_comment_id (str): The ID of the parent comment.

        Returns:
            dict: The reply data in dictionary format.
        """
        reply = Comment(post_id=self.post_id, user_id=user_id, content=content, parent_id=parent_comment_id)
        reply.save()
        return reply.to_dict()

    def to_dict(self):
        """
        Converts the Comment instance to a dictionary format.

        Returns:
            dict: The comment data in dictionary format.
        """
        return {
            "comment_id": str(self.comment_id),
            "post_id": self.post_id,
            "user_id": self.user_id,
            "content": self.content,
            "parent_id": self.parent_id,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "upvotes": len(self.upvotes),
            "downvotes": len(self.downvotes),
            "replies": self.replies,
            'is_video': self.is_video
        }


def convert_comment_doc_to_comment(document, convert_vote_count=False):
    """
    Converts a MongoDB document to a comment dictionary.

    Args:
        document (dict): The MongoDB document representing a comment.
        convert_vote_count (bool, optional): If True, convert upvotes and downvotes to counts.

    Returns:
        dict or None: The comment data in dictionary format or None if the document is None.
    """
    if document:
        return {
            "comment_id": str(document["_id"]),
            "post_id": document["post_id"],
            "user_id": document["user_id"],
            "content": document["content"],
            "parent_id": document.get("parent_id"),
            "created_at": document["created_at"],
            "updated_at": document["updated_at"],
            "upvotes": len(document["upvotes"]) if convert_vote_count else document["upvotes"],
            "downvotes": len(document["downvotes"]) if convert_vote_count else document["downvotes"],
            "replies": document["replies"],
            "is_video": document["is_video"]
        }
    else:
        return None
