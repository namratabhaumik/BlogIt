""" Author: MD Samshad Rahman """

from flask import Blueprint, request
from app.controllers.comment_controller import (
    create_comment,
    get_comments,
    update_comment,
    delete_comment,
    vote_comment, add_reply
)

# Create a Blueprint for comment-related routes
comment_bp = Blueprint('comment', __name__)


@comment_bp.route('/comments', methods=['POST'])
def route_create_comment():
    """
    Route to handle the creation of a new comment.
    Expects a JSON payload with 'post_id', 'user_id', and 'content'.
    """
    return create_comment()


@comment_bp.route('/<post_id>/comments', methods=['GET'])
def route_get_comments(post_id):
    """
    Route to retrieve comments for a specific post.
    Args:
        post_id (str): The ID of the post to get comments for.
        is_video (bool): Indicates if the post is video or not.
    """
    is_video = request.args.get('is_video', False)
    return get_comments(post_id, is_video)


@comment_bp.route('/comments/<comment_id>', methods=['PUT'])
def route_update_comment(comment_id):
    """
    Route to update an existing comment.
    Args:
        comment_id (str): The ID of the comment to update.
    """
    return update_comment(comment_id)


@comment_bp.route('/comments/<comment_id>', methods=['DELETE'])
def route_delete_comment(comment_id):
    """
    Route to delete a specific comment.
    Args:
        comment_id (str): The ID of the comment to delete.
    """
    return delete_comment(comment_id)


@comment_bp.route('/comments/<comment_id>/vote', methods=['POST'])
def route_vote_comment(comment_id):
    """
    Route to vote on a specific comment.
    Args:
        comment_id (str): The ID of the comment to vote on.
    """
    return vote_comment(comment_id)


@comment_bp.route('/comments/<comment_id>/reply', methods=['POST'])
def route_add_reply(comment_id):
    """
    Route to add a reply to a specific comment.
    Args:
        comment_id (str): The ID of the comment to reply to.
    """
    return add_reply(comment_id)
