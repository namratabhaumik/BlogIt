# Author - Zeel Ravalani (B00917373)
from app.routes.community_analysis_routes import community_analysis_bp

def register_routes(app):
    """
    Register the community analysis routes with the Flask application.

    :param app: The Flask application instance to register the routes with
    :returns: None
    :author: Zeel Ravalani
    """
    app.register_blueprint(community_analysis_bp)
