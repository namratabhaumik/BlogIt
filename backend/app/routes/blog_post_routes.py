# Author - 
# Modified by - Pratik Sakaria (B00954261)
from flask import Blueprint, request, jsonify
from app.services.blog_post_service import BlogPostService
from app.services.community_analysis_service import CommunityAnalysisService
from datetime import datetime


blogs_bp = Blueprint('blogs', __name__, url_prefix='/blogs')

@blogs_bp.route('/create', methods=['POST'])
def create_blog_post():
    try:
        print("Received request to create a blog post")
        
        data = request.get_json()
        print(f"Request data: {data}")
        
        blog_id = data.get('blog_post_id')
        title = data.get('title')
        author = data.get('author')
        tags = data.get('tags')
        image_url = data.get('image_url')
        content = data.get('content')
        community_id = data.get('community_id', "")  # Default to empty string if not present
        timestamp = datetime.now().isoformat()
        
        print(f"Extracted parameters - blog_id: {blog_id}, title: {title}, author: {author}, tags: {tags}, image_url: {image_url}, content: {content}, community_id: {community_id}, timestamp: {timestamp}")

        # Check for missing parameters
        if not all([blog_id, title, author, tags, image_url, content]):
            print("Missing parameters detected")
            return jsonify({'error': 'Missing blog post parameters'}), 400

        print("All required parameters are present")
        
        # Call the service to create a blog post
        BlogPostService.create_blog_post(
            blog_id,
            title,
            author,
            tags,
            image_url,
            content,
            community_id,  # Pass community_id to the service
            timestamp
        )
        
        print("Blog post created successfully")
        return jsonify({'message': 'Post created successfully'}), 201
    
    except ValueError as e:
        print(f"ValueError: {e}")
        return jsonify({'error': str(e)}), 400
    
    except Exception as e:
        print(f"Exception: {e}")
        return jsonify({'error': 'An internal server error occurred: ' + str(e)}), 500


@blogs_bp.route('/get/all', methods=['GET'])
def get_all_videos():
    try:
        community_id = request.args.get('community_id')  # Get community_id from query parameters
        print(f"community_id: {community_id}")
        blogs = BlogPostService.get_all_blogs(community_id)
        # print(f"get_all_blogs: {blogs}")
        return jsonify({'message': 'Retrieved Blogs successfully', 'blogs': blogs}), 200
    except Exception as e:
        return jsonify({'error': 'An internal server error occurred: ' + str(e)}), 500
    
@blogs_bp.route('/get/<blog_id>', methods=['GET'])
def get_video_post(blog_id):
    try:
        blog = BlogPostService.get_post_by_id(blog_id)
        if blog:
            return jsonify(blog), 200
        else:
            return jsonify({'error': 'Post not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@blogs_bp.route('/edit/<id>', methods=['PUT'])
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
        BlogPostService.edit_post_by_id(id, updates)
        return jsonify({'message': 'Post updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@blogs_bp.route('/delete/<id>', methods=['DELETE'])
def delete_post(id):
    try:
        deleted_count = BlogPostService.delete_post_by_id(id)
        if deleted_count != 0:
            return jsonify({'message': 'Post deleted successfully'}), 200
        else:
            return jsonify({'error': 'Post not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@blogs_bp.route('/get_user_engagement_metrics/<community_id>', methods=['GET'])
def get_user_engagement_metrics(community_id):
    print(f"Received request to get user engagement metrics for community_id: {community_id}")
    try:
        user_engagement_metrics = CommunityAnalysisService.get_community_content_statistics(community_id)
        print(f"Fetched user engagement metrics: {user_engagement_metrics}")

        if user_engagement_metrics:
            return jsonify(user_engagement_metrics), 200
        else:
            print("User engagement metrics not found")
            return jsonify({'error': 'User engagement metrics not found'}), 404
    except Exception as e:
        print(f"Exception occurred: {str(e)}")
        return jsonify({'error': str(e)}), 500

@blogs_bp.route('/get/users/<user_id>', methods=["GET"])
def get_blogs_by_user_id(user_id):
    try:
        blogs = BlogPostService.get_posts_by_user_id(user_id)
        return jsonify({'message': 'Retrieved Blogs successfully', 'blogs': blogs}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
