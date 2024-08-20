# Author - Zeel Ravalani (B00917373)
from flask import Blueprint, request, jsonify
from app.services.community_analysis_service import CommunityAnalysisService

community_analysis_bp = Blueprint('community_analysis', __name__, url_prefix='/community_analysis')

@community_analysis_bp.route('/get_user_engagement_metrics/<community_id>', methods=['GET'])
def get_user_engagement_metrics(community_id):
    """
    Fetch user engagement metrics for a specific community.

    :param community_id: The ID of the community to fetch metrics for
    :returns: JSON response with user engagement metrics or error message
    :author: Zeel Ravalani
    """
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

@community_analysis_bp.route('/get_monthly_blog_and_video_posts_data/<community_id>', methods=['GET'])
def get_monthly_blog_and_video_posts_data(community_id):
    """
    Fetch monthly blog and video posts data for a specific community.

    :param community_id: The ID of the community to fetch data for
    :returns: JSON response with monthly blog and video posts data or error message
    :author: Zeel Ravalani
    """
    print(f"Received request to get monthly blog and video posts data for community_id: {community_id}")
    try:
        monthly_posts_data = CommunityAnalysisService.get_monthly_posts_data(community_id)
        print(f"Fetched monthly blog and video posts data: {monthly_posts_data}")

        if monthly_posts_data['result'] == 'success':
            return jsonify(monthly_posts_data), 200
        else:
            print("Monthly blog and video posts data retrieval failed")
            return jsonify({'error': 'Monthly blog and video posts data retrieval failed'}), 404
    except Exception as e:
        print(f"Exception occurred: {str(e)}")
        return jsonify({'error': str(e)}), 500

@community_analysis_bp.route('/get_monthly_bookmarks_data/<community_id>', methods=['GET'])
def get_monthly_bookmarks_data(community_id):
    """
    Fetch monthly bookmarks data for a specific community.

    :param community_id: The ID of the community to fetch data for
    :returns: JSON response with monthly bookmarks data or error message
    :author: Zeel Ravalani
    """
    print(f"Received request to get monthly bookmarks data for community_id: {community_id}")
    try:
        bookmarks_data = CommunityAnalysisService.get_monthly_bookmark_data(community_id)
        print(f"Fetched monthly bookmarks data: {bookmarks_data}")

        if bookmarks_data['result'] == 'success':
            return jsonify(bookmarks_data), 200
        else:
            print(f"Error in bookmarks data: {bookmarks_data['message']}")
            return jsonify({'error': bookmarks_data['message']}), 404
    except Exception as e:
        print(f"Exception occurred: {str(e)}")
        return jsonify({'error': str(e)}), 500

@community_analysis_bp.route('/get_community_posts_sentiment/<community_id>', methods=['GET'])
def get_community_posts_sentiment(community_id):
    """
    Fetch sentiment data for community posts.

    :param community_id: The ID of the community to fetch sentiment data for
    :returns: JSON response with community posts sentiment data or error message
    :author: Zeel Ravalani
    """
    print(f"Received request to get community posts sentiment for community_id: {community_id}")
    try:
        sentiment_data = CommunityAnalysisService.get_community_posts_sentiment(community_id)
        print(f"Fetched community posts sentiment: {sentiment_data}")

        if sentiment_data['result'] == 'success':
            return jsonify(sentiment_data), 200
        else:
            print(f"Error in sentiment data: {sentiment_data['message']}")
            return jsonify({'error': sentiment_data['message']}), 404
    except Exception as e:
        print(f"Exception occurred: {str(e)}")
        return jsonify({'error': str(e)}), 500

@community_analysis_bp.route('/get_demographic_insights/<community_id>', methods=['GET'])
def get_demographic_insights(community_id):
    """
    Fetch demographic insights for a specific community.

    :param community_id: The ID of the community to fetch demographic insights for
    :returns: JSON response with demographic insights or error message
    :author: Zeel Ravalani
    """
    print(f"Received request to get demographic insights for community_id: {community_id}")
    try:
        # Call the service method to get demographic insights
        demographic_insights = CommunityAnalysisService.get_demographic_insights(community_id)
        print(f"Fetched demographic insights: {demographic_insights}")

        if demographic_insights['result'] == 'success':
            return jsonify(demographic_insights), 200
        else:
            print(f"Error in demographic insights: {demographic_insights['message']}")
            return jsonify({'error': demographic_insights['message']}), 404
    except Exception as e:
        print(f"Exception occurred: {str(e)}")
        return jsonify({'error': str(e)}), 500