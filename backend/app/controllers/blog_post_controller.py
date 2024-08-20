from app.routes.blog_post_routes import blog_bp

def register_routes(app):
    app.register_blueprint(blog_bp)
