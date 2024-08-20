from app.models.video_post import VideoPost

class VideoPostService:
    @staticmethod
    def create_video_post(
        video_post_id,
        video_url,
        title,
        author,
        tags,
        time,
        thumbnail_url,
        content,
        community_id
    ):
        videoPost = VideoPost(
            video_post_id,
            video_url,
            title,
            author,
            tags,
            time,
            thumbnail_url,
            content,
            community_id
        )
        videoPost.save()

    @staticmethod
    def get_post_by_id(id):
        return VideoPost.get_post_by_id(id)

    @staticmethod
    def get_all_videos():
        return VideoPost.get_all_posts()
    
    @staticmethod
    def get_posts_by_user_id(user_id):
        return VideoPost.get_posts_by_user_id(user_id)

    @staticmethod
    def edit_post_by_id(video_post_id, updates):
        videoPost = VideoPost.get_post_by_id(video_post_id)
        if videoPost:
            videoPost.edit(updates)
        else:
            print(f"No video post found with ID {video_post_id}")

    @staticmethod
    def delete_post_by_id(id):
        return VideoPost.delete_post_by_id(id)