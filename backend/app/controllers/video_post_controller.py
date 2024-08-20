from app.routes.video_post_routes import videos_bp

def register_routes(app):
    app.register_blueprint(videos_bp)
