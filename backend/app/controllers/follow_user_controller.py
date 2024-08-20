# Author - Zeel Ravalani (B00917373)
from app.routes.follow_user_routes import follow_users_bp

def register_routes(app):
    app.register_blueprint(follow_users_bp)
