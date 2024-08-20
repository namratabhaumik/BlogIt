"""
Author: MD Samshad Rahman
"""

from datetime import datetime
from app.models.comment import Comment
from app.services.blog_post_service import BlogPostService
from app.services.notification_service import send_notification_to_user
from app.services.user_service import UserService
from app.services.video_post_service import VideoPostService


class CommentService:
    def create_comment(self, post_id, user_id, content, is_video):
        """
        Creates a new comment on a post.

        Args:
            post_id (str): The ID of the post.
            user_id (str): The ID of the user making the comment.
            content (str): The content of the comment.
            is_video (bool): Indicates if the post is video or not.

        Returns:
            dict: The created comment in dictionary format.
        """
        comment = Comment(post_id, user_id, content, is_video=is_video)
        comment.save()

        post = self.get_post_id_by_post_id(post_id, is_video)
        if not post:
            print(f"Notification failed for post ID {post_id}")
            return comment.to_dict()

        post_title = post.get('title')
        post_author = post.get('author')
        comment_author = UserService.get_user_by_id(user_id)
        commenter_username = comment_author.get('username', 'Someone')

        notification_title = "New Comment on Your Post"
        notification_body = f"{commenter_username} has commented on your post: '{post_title}'. Check it out!"

        self.notify_user(post_author, notification_title, notification_body)
        return comment.to_dict()

    @staticmethod
    def get_comments(post_id, is_video):
        """
        Retrieves all comments for a given post.

        Args:
            post_id (str): The ID of the post.
            is_video (bool): Indicates if the post is video or not.

        Returns:
            list: A list of comments for the post.
        """
        return Comment.get_by_post_id(post_id, is_video)

    @staticmethod
    def update_comment(comment_id, user_id, content):
        """
        Updates an existing comment.

        Args:
            comment_id (str): The ID of the comment to update.
            user_id (str): The ID of the user who owns the comment.
            content (str): The new content for the comment.

        Returns:
            dict or None: The updated comment in dictionary format, or None if the update failed.
        """
        comment = Comment.get_by_id(comment_id)
        if comment and comment['user_id'] == user_id:
            comment_obj = Comment(**comment)
            comment_obj.content = content
            comment_obj.updated_at = datetime.utcnow()
            is_updated = comment_obj.update({'content': content, 'updated_at': datetime.utcnow()})
            if is_updated:
                return comment_obj.to_dict()
            else:
                return None
        print(f"No comment found with user ID: {user_id} and comment ID: {comment_id}")
        return None

    @staticmethod
    def delete_comment(comment_id, user_id):
        """
        Deletes a comment by its ID.

        Args:
            comment_id (str): The ID of the comment to delete.
            user_id (str): The ID of the user who owns the comment.

        Returns:
            int: The number of deleted comments (1 if successful, 0 otherwise).
        """
        return Comment.delete_by_id(comment_id, user_id)

    def vote_comment(self, comment_id, user_id, vote_type):
        """
        Adds a vote (upvote or downvote) to a comment.

        Args:
            comment_id (str): The ID of the comment to vote on.
            user_id (str): The ID of the user voting.
            vote_type (str): The type of vote ('upvote' or 'downvote').

        Returns:
            str: The result of the voting operation.
        """
        comment = Comment.get_by_id(comment_id)
        if comment:
            comment_obj = Comment(**comment)
            vote_result = comment_obj.add_vote(user_id, vote_type)

            comment_content = comment.get('content')
            comment_author = comment.get('user_id')

            if vote_type == 'upvote':
                notification_title = "Your Comment Received an Upvote"
                notification_body = f"Great news! Your comment: '{comment_content}' has been upvoted. Keep engaging!"
            else:
                notification_title = "Your Comment Received a Downvote"
                notification_body = (f"Heads up! Your comment: '{comment_content}' has received a downvote. "
                                     f"Stay positive and keep contributing!")

            self.notify_user(comment_author, notification_title, notification_body)
            return vote_result
        return Comment.VOTE_FAILED

    def add_reply(self, parent_comment_id, user_id, content):
        """
        Adds a reply to an existing comment.

        Args:
            parent_comment_id (str): The ID of the parent comment to reply to.
            user_id (str): The ID of the user replying.
            content (str): The content of the reply.

        Returns:
            dict or None: The reply data in dictionary format, or None if the reply could not be added.
        """
        parent_comment = Comment.get_by_id(parent_comment_id)
        if parent_comment:
            parent_comment_obj = Comment(**parent_comment)
            reply = parent_comment_obj.add_reply(user_id, content, parent_comment_id)

            comment_content = parent_comment.get('content')
            comment_author = parent_comment.get('user_id')
            reply_author = UserService.get_user_by_id(user_id)
            if not reply_author:
                print(f"Notification failed for Comment ID {parent_comment_id} \n"
                      f"Author Not found for Author Id: {user_id}")
                return reply
            replier_username = reply_author.get('username', 'Someone')

            notification_title = "New Reply to Your Comment"
            notification_body = (f"{replier_username} has replied to your comment: '{comment_content}'. "
                                 f"See the discussion!")

            self.notify_user(comment_author, notification_title, notification_body)
            return reply
        return None

    @staticmethod
    def get_post_id_by_post_id(post_id, is_video):
        """
        Retrieves post data by its ID.

        Args:
            post_id (str): The ID of the post.

        Returns:
            dict or None: The post data, or None if the post is not found.
        """
        if is_video:
            return BlogPostService.get_post_by_id(post_id)
        else:
            return VideoPostService.get_post_by_id(post_id)

    @staticmethod
    def notify_user(user_id, notification_title, notification_text):
        """
        Sends a notification to a user.

        Args:
            user_id (str): The ID of the user to notify.
            notification_title (str): The title of the notification.
            notification_text (str): The body text of the notification.
        """
        receiver = UserService.get_user_by_id(user_id)
        if receiver and receiver.get('fcm_token'):
            send_notification_to_user(receiver.get('fcm_token'), notification_title, notification_text)
