from flask import Blueprint, request, jsonify
from app.services.user_service import UserService

user_bp = Blueprint('users', __name__, url_prefix='/users')

@user_bp.route('/create', methods=['POST'])
def create_user():
    try:
        data = request.get_json()
        user_id = data.get('id')
        username = data.get('username')
        email = data.get('email')
        name = data.get('name')
        web_url = data.get('web_url')
        location = data.get('location')
        bio = data.get('bio')
        pronouns = data.get('pronouns')
        education = data.get('education')
        work_status = data.get('work_status')
        profile_pic = data.get('profile_pic')
        profile_banner = data.get('profile_banner')
        join_date = data.get('join_date')

        if all([
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
        ]):
            return jsonify({'error': 'Missing user parameters'}), 400

        UserService.create_user(
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

        return jsonify({'message': 'User created successfully'}), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'An internal server error occurred: ' + str(e)}), 500


@user_bp.route('/check_username', methods=['POST'])
def check_username():
    try:
        data = request.get_json()
        username_exists = data.get("username_exists")

        if username_exists is None:
            return jsonify({'error': 'Missing "username_exists" parameter'}), 400

        doc = UserService.get_user_by_username(username_exists)
        return jsonify({"exists": False if doc is None else True}), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'An internal server error occurred: ' + str(e)}), 500

@user_bp.route('/all', methods=['GET'])
def get_all_users():
    try:
        users = UserService.get_all_users()

        return jsonify({'message': 'Retrieved Users successfully', 'users': users}), 200
    except Exception as e:
        return jsonify({'error': 'An internal server error occurred: ' + str(e)}), 500
    
@user_bp.route('/<user_id>', methods=['GET'])
def get_user(user_id):
    try:
        user = UserService.get_user_by_id(user_id)
        if user:
            return jsonify(user.to_dict()), 200
        else:
            return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/uname/<username>', methods=['GET'])
def get_user_username(username):
    try:
        user = UserService.get_user_by_username(username)
        if user:
            return jsonify(user.to_dict()), 200
        else:
            return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        deleted_count = UserService.delete_user_by_id(user_id)
        if deleted_count != 0:
            return jsonify({'message': 'User deleted successfully'}), 200
        else:
            return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/update/<user_id>', methods=['POST'])
def update_user(user_id):
    form_data = request.form
    user_attr = dict([(key, form_data.get(key)) for key in form_data])

    try:
        matched_count = UserService.update_user_by_id(user_id, user_attr)
        if matched_count != 0:
            return jsonify({'message': 'User updated successfully'}), 200
        else:
            return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500