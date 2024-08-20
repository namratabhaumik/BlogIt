# Author - Zeel Ravalani (B00917373)
from flask import Blueprint, request, jsonify
from app.services.follows_service import FollowService

follow_users_bp = Blueprint('follow_users', __name__, url_prefix='/users')

@follow_users_bp.route('/follow', methods=['POST'])
def follow_user():
    data = request.json
    follower_id = data.get('currentUserDataId')  # Corresponds to the current logged-in user
    following_id = data.get('followUserDataId')  # Corresponds to the user being followed
    
    if not follower_id or not following_id:
        return jsonify({"error": "Both follower_id and following_id are required"}), 400
    
    success = FollowService.add_follower(follower_id, following_id)
    if success:
        return jsonify({"message": "Successfully followed user"}), 200
    else:
        return jsonify({"error": "Failed to follow user"}), 500

@follow_users_bp.route('/unfollow', methods=['POST'])
def unfollow_user():
    data = request.json
    follower_id = data.get('currentUserDataId')  # Corresponds to the current logged-in user
    following_id = data.get('followUserDataId')  # Corresponds to the user being unfollowed
    
    if not follower_id or not following_id:
        return jsonify({"error": "Both follower_id and following_id are required"}), 400
    
    success = FollowService.remove_follower(follower_id, following_id)
    if success:
        return jsonify({"message": "Successfully unfollowed user"}), 200
    else:
        return jsonify({"error": "Failed to unfollow user"}), 500

@follow_users_bp.route('/<user_id>/followers', methods=['GET'])
def get_followers(user_id):
    followers = FollowService.get_followers_with_details(user_id)
    return jsonify(followers), 200

@follow_users_bp.route('/<user_id>/following', methods=['GET'])
def get_following(user_id):
    following = FollowService.get_following_with_details(user_id)
    return jsonify(following), 200
