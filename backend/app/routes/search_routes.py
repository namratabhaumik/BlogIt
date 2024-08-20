# Author - Pratik Sakaria (B00954261)
from flask import Blueprint, request, jsonify
from app.services.search_service import SearchService

search_bp = Blueprint('search', __name__)

@search_bp.route('/search', methods=['GET'])
def search_site():
    query = request.args.get('q', '')
    if not query:
        return jsonify({"error": "Query parameter is required"}), 400
    
    try:
        results = SearchService.search_site(query)
        if not results['blog_posts'] and not results['communities']:
            return jsonify({"message": "No results found"}), 404
        return jsonify(results), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
