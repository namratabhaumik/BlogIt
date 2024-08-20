# Author - Pratik Sakaria (B00954261)
from flask import Blueprint, request, jsonify
from app.services.community_service import CommunityService

community_bp = Blueprint('communities', __name__, url_prefix='/communities')

@community_bp.route('/create', methods=['POST'])
def create_community():
    try:
        data = request.get_json()
        community_id = data.get('community_id')
        community_name = data.get('community_name')
        community_desc = data.get('community_desc')
        community_members_list = data.get('community_members_list')
        admin = data.get('admin')

        if not all([community_id, community_name, community_desc, admin]):
            return jsonify({'error': 'Missing community parameters'}), 400

        CommunityService.create_community(
            community_id,
            community_name,
            community_desc,
            community_members_list,
            admin
        )

        return jsonify({'message': 'Community created successfully'}), 201
    except Exception as e:
        return jsonify({'error': 'An internal server error occurred: ' + str(e)}), 500

@community_bp.route('/user/<user_id>', methods=['GET'])
def get_user_communities(user_id):
    try:
        communities = CommunityService.get_communities_by_user(user_id)
        return jsonify({'message': 'Communities retrieved successfully', 'communities': communities}), 200
    except Exception as e:
        app.logger.error(f'Error retrieving communities for user {user_id}: {str(e)}')
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500

@community_bp.route('/<community_id>', methods=['GET'])
def get_community_by_id(community_id):
    try:
        community = CommunityService.get_community_by_id(community_id)
        if community:
            return jsonify({'message': 'Community retrieved successfully', 'community': community}), 200
        else:
            return jsonify({'error': 'Community not found'}), 404
    except Exception as e:
        current_app.logger.error(f'Error retrieving community {community_id}: {str(e)}')  # Use current_app
        return jsonify({'error': f'An internal server error occurred: {str(e)}'}), 500
