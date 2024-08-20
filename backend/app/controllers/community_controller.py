# Author - Pratik Sakaria (B00954261)
from app.routes.community_routes import community_bp

def register_routes(app):
    app.register_blueprint(community_bp)
