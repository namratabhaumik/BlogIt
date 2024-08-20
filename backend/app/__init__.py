from flask import Flask
from flask_pymongo import PyMongo
from app.config import Config
from flask_cors import CORS

mongo = PyMongo()


def create_app():
    app = Flask(__name__)
    CORS(app, resources={r'/*': {"origins": '*'}})
    app.config.from_object(Config)

    # Initialize MongoDB
    mongo.init_app(app)

    # Register blueprints or routes
    from app.routes.user_routes import user_bp
    from app.routes.bookmark_routes import bookmark_bp
    from app.routes.video_post_routes import videos_bp
    from app.routes.blog_post_routes import blogs_bp
    from app.routes.community_routes import community_bp
    from app.routes.community_analysis_routes import community_analysis_bp
    from app.routes.tag_routes import tag_bp
    from app.routes.search_routes import search_bp
    from app.routes.comment_routes import comment_bp
    from app.routes.follow_user_routes import follow_users_bp
    app.register_blueprint(user_bp)
    app.register_blueprint(bookmark_bp)
    app.register_blueprint(videos_bp)
    app.register_blueprint(blogs_bp)
    app.register_blueprint(community_bp)
    app.register_blueprint(community_analysis_bp)
    app.register_blueprint(tag_bp)
    app.register_blueprint(search_bp)
    app.register_blueprint(comment_bp)
    app.register_blueprint(follow_users_bp)

    return app
