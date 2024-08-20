# Author - Zeel Ravalani (B00917373)
from app.models.follows import Follow
from app.models.user import User

class FollowService:
    @staticmethod
    def add_follower(follower_id, following_id):
        """
        Add a follower to a user.

        :param follower_id: ID of the user who is following
        :param following_id: ID of the user being followed
        :returns: True if the follow relationship is successfully created, otherwise False
        """
        follow = Follow(follower_id=follower_id, following_id=following_id)
        try:
            follow.save()
            return True
        except Exception as e:
            print(f"Error adding follower: {e}")
            return False

    @staticmethod
    def remove_follower(follower_id, following_id):
        """
        Remove a follower from a user.

        :param follower_id: ID of the user who is following
        :param following_id: ID of the user being followed
        :returns: True if the follow relationship is successfully removed, otherwise False
        """
        return Follow.remove_follower(follower_id, following_id)

    @staticmethod
    def get_followers_with_details(user_id):
        """
        Get a list of followers with detailed information.

        :param user_id: ID of the user whose followers are being retrieved
        :returns: List of users following the user
        """
        try:
            follower_ids = Follow.get_followers(user_id)
            follower_users = User.get_users_by_ids(follower_ids)
            # Convert User objects to dictionaries
            follower_users_dicts = [user.to_dict() for user in follower_users]
            print(f"follower_users_count: {len(follower_users_dicts)}")
            return follower_users_dicts
        except Exception as e:
            print(f"Error retrieving followers with details: {e}")
            return []

    @staticmethod
    def get_following_with_details(user_id):
        """
        Get a list of users the given user is following with detailed information.

        :param user_id: ID of the user whose following list is being retrieved
        :returns: List of users the user is following
        """
        try:
            following_ids = Follow.get_following(user_id)
            following_users = User.get_users_by_ids(following_ids)
            # Convert User objects to dictionaries
            following_users_dicts = [user.to_dict() for user in following_users]
            print(f"following_users_count: {len(following_users_dicts)}")
            return following_users_dicts
        except Exception as e:
            print(f"Error retrieving following with details: {e}")
            return []
