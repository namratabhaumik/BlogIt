from flask import Blueprint, jsonify
from app.services.tag_service import TagService

tag_bp = Blueprint('tags', __name__, url_prefix='/tags')


@tag_bp.route('/all', methods=['GET'])
def get_all_tags_with_counts():
    try:
        tags_with_counts = TagService.get_tag_counts()
        return jsonify(tags_with_counts), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
