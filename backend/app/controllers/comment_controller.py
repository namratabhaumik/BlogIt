"""
Author: MD Samshad Rahman
"""

from flask import jsonify, request
from app.models.comment import Comment
from app.services.comment_service import CommentService

# Initialize the CommentService
comment_service = CommentService()


def create_comment():
    """
    Create a new comment.

    Expects a JSON payload with 'post_id', 'user_id', and 'content'.
    Returns a JSON response with a status code and a message.
    """
    data = request.get_json()
    post_id = data.get('post_id')
    is_video = data.get('is_video')
    user_id = data.get('user_id')
    content = data.get('content')
    if is_video == 'true' or is_video == 'True':
        is_video = True
    else:
        is_video = False

    # Validation: Ensure required fields are present
    if not post_id or not user_id or not content:
        return jsonify({
            "code": "CCF_400",
            "message": "Comment Creation Failed. 'post_id', 'user_id', and 'content' must be provided.",
            "data": {}
        }), 400

    comment = comment_service.create_comment(post_id, user_id, content, is_video)
    if comment:
        return jsonify({
            "code": "CCS_200",
            "message": "Comment Created Successfully.",
            "data": comment
        }), 201

    return jsonify({
        "code": "CCF_400",
        "message": "Comment Creation Failed.",
        "data": {}
    }), 400


def get_comments(post_id, is_video):
    """
    Retrieve comments for a specific post.

    Args:
        post_id (str): The ID of the post.
        is_video (bool): Indicates if the post is video or not.

    Returns a JSON response with a list of comments and a status code.
    """
    if not post_id:
        return jsonify({
            "code": "VDNP_400",
            "message": "Valid Data Not Provided.",
            "data": []
        }), 400

    if is_video == 'true' or is_video == 'True':
        is_video = True
    else:
        is_video = False

    comments = comment_service.get_comments(post_id, is_video)
    if comments:
        return jsonify({
            "code": "RCS_200",
            "message": "Comments Retrieved Successfully.",
            "data": comments
        }), 200

    return jsonify({
        "code": "RCF_400",
        "message": "Comments Retrieval Failed.",
        "data": []
    }), 400


def update_comment(comment_id):
    """
    Update an existing comment.

    Expects a JSON payload with 'user_id' and 'content'.
    Args:
        comment_id (str): The ID of the comment to update.

    Returns a JSON response with the updated comment and a status code.
    """
    data = request.get_json()
    user_id = data.get('user_id')
    content = data.get('content')

    comment = comment_service.update_comment(comment_id, user_id, content)
    if comment:
        return jsonify({
            "code": "UCS_200",
            "message": "Comment Updated Successfully.",
            "data": comment
        }), 200

    return jsonify({
        "code": "UCF_400",
        "message": "Comment Update Failed.",
        "data": {}
    }), 400


def delete_comment(comment_id):
    """
    Delete a comment.

    Expects a JSON payload with 'user_id'.
    Args:
        comment_id (str): The ID of the comment to delete.

    Returns a JSON response with a status code indicating success or failure.
    """
    data = request.get_json()
    user_id = data.get('user_id')

    # Validation: Ensure required fields are present
    if not user_id:
        return jsonify({
            "code": "CCF_400",
            "message": "Comment Deletion Failed. 'user_id' must be provided.",
            "data": {}
        }), 400

    result = comment_service.delete_comment(comment_id, user_id)
    if result:
        return jsonify({
            "code": "DCS_200",
            "message": "Comment Deleted Successfully.",
            "data": {}
        }), 200

    return jsonify({
        "code": "DCF_400",
        "message": "Comment Deletion Failed.",
        "data": {}
    }), 400


def vote_comment(comment_id):
    """
    Vote on a comment.

    Expects a JSON payload with 'user_id' and 'vote_type' (either 'upvote' or 'downvote').
    Args:
        comment_id (str): The ID of the comment to vote on.

    Returns a JSON response with a status code indicating the result of the voting.
    """
    data = request.get_json()
    user_id = data.get('user_id')
    vote_type = data.get('vote_type')

    vote_result = comment_service.vote_comment(comment_id, user_id, vote_type)
    if vote_result == Comment.ALREADY_UPVOTED:
        return jsonify({
            "code": "VCF_400",
            "message": "You have already upvoted this comment.",
            "data": {}
        }), 400
    elif vote_result == Comment.ALREADY_DOWNVOTED:
        return jsonify({
            "code": "VCF_400",
            "message": "You have already downvoted this comment.",
            "data": {}
        }), 400
    elif vote_result == Comment.VOTE_SUCCESS:
        return jsonify({
            "code": "VCS_200",
            "message": "Vote Successful.",
            "data": {}
        }), 200
    else:
        return jsonify({
            "code": "VCF_400",
            "message": "Vote Failed.",
            "data": {}
        }), 400


def add_reply(comment_id):
    """
    Add a reply to a comment.

    Expects a JSON payload with 'user_id' and 'content'.
    Args:
        comment_id (str): The ID of the comment to reply to.

    Returns a JSON response with the created reply and a status code.
    """
    data = request.get_json()
    user_id = data.get('user_id')
    content = data.get('content')

    # Validation: Ensure required fields are present
    if not user_id or not content:
        return jsonify({
            "code": "CRF_400",
            "message": "Reply Creation Failed. 'user_id' and 'content' must be provided.",
            "data": {}
        }), 400

    reply = comment_service.add_reply(comment_id, user_id, content)
    if reply:
        return jsonify({
            "code": "CRS_200",
            "message": "Reply Added Successfully.",
            "data": reply
        }), 201

    return jsonify({
        "code": "CRF_400",
        "message": "Reply Creation Failed.",
        "data": {}
    }), 400
