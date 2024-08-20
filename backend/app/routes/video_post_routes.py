from flask import Blueprint, request, jsonify
from app.services.video_post_service import VideoPostService
from datetime import datetime

videos_bp = Blueprint('videos', __name__, url_prefix='/videos')

@videos_bp.route('/create', methods=['POST'])
def create_video_post():
    try:
        print("Received request to create a blog post")

        data = request.get_json()
        print(f"Request data: {data}")
 
        video_id = data.get('video_post_id')
        video_url = data.get('video_url')
        title = data.get('title')
        author = data.get('author')
        tags = data.get('tags')
        time = data.get('time')
        thumbnail_url = data.get('thumbnail_url')
        content = data.get('content')
        community_id = data.get('community_id', "")  # Default to empty string if not present

        print(f"Extracted parameters - video_id: {video_id}, video_url: {video_url}, title: {title}, author: {author}, tags: {tags}, time: {time}, thumbnail_url: {thumbnail_url}, content: {content}, community_id: {community_id}")

        if not all([video_id, video_url, title, author, tags, time, thumbnail_url, content]):
            print("Missing parameters detected")
            return jsonify({'error': 'Missing video post parameters'}), 400

        print("All required parameters are present")

        # Call the service to create a video post
        VideoPostService.create_video_post(
            video_id,
            video_url,
            title,
            author,
            tags,
            time,
            thumbnail_url,
            content,
            community_id  # Pass community_id to the service
        )

        print("Blog post created successfully")
        return jsonify({'message': 'Post created successfully'}), 201

    except ValueError as e:
        print(f"ValueError: {e}")
        return jsonify({'error': str(e)}), 400

    except Exception as e:
        print(f"Exception: {e}")
        return jsonify({'error': 'An internal server error occurred: ' + str(e)}), 500

@videos_bp.route('/get/all', methods=['GET'])
def get_all_videos():
    try:
        vidoes = VideoPostService.get_all_videos()

        return jsonify({'message': 'Retrieved Videos successfully', 'videos': vidoes}), 200
    except Exception as e:
        return jsonify({'error': 'An internal server error occurred: ' + str(e)}), 500
    
@videos_bp.route('/get/<video_id>', methods=['GET'])
def get_video_post(video_id):
    try:
        video = VideoPostService.get_post_by_id(video_id)
        if video:
            return jsonify(video), 200
        else:
            return jsonify({'error': 'Post not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@videos_bp.route('/edit/<id>', methods=['PUT'])
def edit_video_post(id):
    data = request.get_json()
    
    updates = {
        'title': data.get('title'),
        'content': data.get('content'),
        'tags': data.get('tags'),
        'time': data.get('time'),
        'author': data.get('author'),
        'thumbnail_url': data.get('thumbnail_url'),
        'video_url': data.get('video_url')
    }
    
    if not id:
        return jsonify({'error': 'Post ID is required'}), 400

    try:
        VideoPostService.edit_post_by_id(id, updates)
        return jsonify({'message': 'Post updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@videos_bp.route('/delete/<id>', methods=['DELETE'])
def delete_post(id):
    try:
        deleted_count = VideoPostService.delete_post_by_id(id)
        if deleted_count != 0:
            return jsonify({'message': 'Post deleted successfully'}), 200
        else:
            return jsonify({'error': 'Post not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@videos_bp.route('/get/users/<user_id>', methods=["GET"])
def get_blogs_by_user_id(user_id):
    try:
        videos = VideoPostService.get_posts_by_user_id(user_id)
        return jsonify({'message': 'Retrieved videos successfully', 'videos': videos}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500