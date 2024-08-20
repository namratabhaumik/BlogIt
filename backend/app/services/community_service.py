# Author - Pratik Sakaria (B00954261)
from app.models.community import Community

class CommunityService:
    @staticmethod
    def create_community(community_id, community_name, community_desc, community_members_list, admin):
        community = Community(
            community_id=community_id,
            community_name=community_name,
            community_desc=community_desc,
            community_members_list=community_members_list,
            admin=admin
        )
        community.save()

    @staticmethod
    def get_communities_by_user(user_id):
        # Fetch communities where the user is either a member or the admin
        user_communities = Community.get_communities_by_user(user_id)
        # Convert each community to a dictionary
        return [CommunityService._convert_to_dict(community) for community in user_communities]

    @staticmethod
    def _convert_to_dict(community):
        # Convert MongoDB ObjectId and any other fields that need conversion
        community['_id'] = str(community['_id'])
        return community

    @staticmethod
    def get_community_by_id(community_id):
        community = Community.get_community_by_id(community_id)
        if community:
            return community.to_dict()
        return None