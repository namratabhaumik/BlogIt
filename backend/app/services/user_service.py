# app/services/user_service.py

from app.models.user import User

class UserService:
    @staticmethod
    def create_user(
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
        user = User(
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
        )
        user.save()

    @staticmethod
    def get_user_by_username(username):
        return User.get_user_by_username(username)

    @staticmethod
    def get_all_users():
        return User.get_all_users()
    
    @staticmethod
    def get_user_by_id(user_id):
        return User.get_user_by_id(user_id)

    @staticmethod
    def get_user_by_username(username):
        return User.get_user_by_username(username)

    @staticmethod
    def delete_user_by_id(user_id):
        return User.delete_user_by_id(user_id)

    @staticmethod
    def update_user_by_id(user_id, user_attr):
        return User.update_user_by_id(user_id, user_attr)