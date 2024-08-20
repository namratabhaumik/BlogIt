# Author - Zeel Ravalani (B00917373)
from app.models.video_post import VideoPost
from app.models.blog_post import BlogPost
from app.models.bookmark import Bookmark
from app.models.community import Community
from app.models.user import User
from datetime import datetime
from textblob import TextBlob
from bs4 import BeautifulSoup
import requests
from collections import defaultdict

class CommunityAnalysisService:
    """
    Service class for community analysis, providing methods to retrieve and analyze community-related data.

    :author: Zeel Ravalani
    """
    
    @staticmethod
    def get_video_posts_by_community_id(community_id):
        """
        Retrieve video posts for a given community.

        :param community_id: ID of the community
        :returns: List of video posts
        """
        return VideoPost.get_video_posts_by_community_id(community_id)

    @staticmethod
    def get_bookmarks_by_community_id(community_id):
        """
        Retrieve bookmarks for a given community.

        :param community_id: ID of the community
        :returns: List of bookmarks
        """
        return Bookmark.get_bookmarks_by_community_id(community_id)

    @staticmethod
    def get_posts_by_community_id(community_id):
        """
        Retrieve blog posts for a given community.

        :param community_id: ID of the community
        :returns: List of blog posts
        """
        return BlogPost.get_posts_by_community_id(community_id)

# UserEngagementMetrices

    @staticmethod
    def get_community_content_statistics(community_id):
        """
        Calculate and return statistics for community content.

        :param community_id: ID of the community
        :returns: Dictionary with counts of video posts, blog posts, and bookmarks
        """
        print(f"get_community_content_statistics Service community_id: {community_id}")
        video_posts = CommunityAnalysisService.get_video_posts_by_community_id(community_id)
        blog_posts = CommunityAnalysisService.get_posts_by_community_id(community_id)
        bookmarks = CommunityAnalysisService.get_bookmarks_by_community_id(community_id)

        # Calculate counts
        video_posts_count = len(video_posts)
        blog_posts_count = len(blog_posts)
        total_bookmarks_count = len(bookmarks)

        print(f"video_posts_count: {video_posts_count}")
        print(f"blog_posts_count: {blog_posts_count}")
        print(f"total_bookmarks_count: {total_bookmarks_count}")

        # Return statistics
        return {
            'community_id': community_id,
            'video_posts_count': video_posts_count,
            'blog_posts_count': blog_posts_count,
            'total_bookmarks_count': total_bookmarks_count
        }
    
    @staticmethod
    def get_monthly_posts_data(community_id):
        """
        Retrieve and organize monthly data for blog and video posts.

        :param community_id: ID of the community
        :returns: Dictionary with monthly counts of blog posts and video posts
        """
        try:
            print(f"get_monthly_posts_data Service community_id: {community_id}")

            # Fetch blog and video posts for the community
            blog_posts = CommunityAnalysisService.get_posts_by_community_id(community_id)
            video_posts = CommunityAnalysisService.get_video_posts_by_community_id(community_id)

            # Initialize a dictionary to hold counts per month
            monthly_data = defaultdict(lambda: {'blog_posts_count': 0, 'video_posts_count': 0})

            # Process blog posts
            for post in blog_posts:
                if 'timestamp' in post:
                    # Ensure timestamp is a datetime object
                    timestamp = post['timestamp'] 
                    if isinstance(timestamp, str):
                        try:
                            timestamp = datetime.fromisoformat(timestamp[:-1])
                        except ValueError:
                            print(f"Warning: Failed to parse timestamp '{timestamp}'")
                            continue
                    month = timestamp.strftime('%b')
                    monthly_data[month]['blog_posts_count'] += 1

            # Process video posts
            for post in video_posts:
                if 'timestamp' in post:
                    # Ensure timestamp is a datetime object
                    timestamp = post['timestamp']
                    if isinstance(timestamp, str):
                        try:
                            timestamp = datetime.fromisoformat(timestamp[:-1])
                        except ValueError:
                            print(f"Warning: Failed to parse timestamp '{timestamp}'")
                            continue
                    month = timestamp.strftime('%b')
                    monthly_data[month]['video_posts_count'] += 1

            # Ensure all months are represented in the output
            all_months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            blog_and_video_posts_data = [
                {
                    'month': month,
                    'blog_posts_count': monthly_data.get(month, {'blog_posts_count': 0})['blog_posts_count'],
                    'video_posts_count': monthly_data.get(month, {'video_posts_count': 0})['video_posts_count']
                }
                for month in all_months
            ]

            print(f"blog_and_video_posts_data: {blog_and_video_posts_data}")

            return {"result": "success", "data": blog_and_video_posts_data}

        except Exception as e:
            print(f"Error: {e}")
            return {"result": "error", "message": "service error--" + str(e)}

    @staticmethod
    def get_monthly_bookmark_data(community_id):
        """
        Retrieve and organize monthly data for bookmarks.

        :param community_id: ID of the community
        :returns: Dictionary with monthly counts of bookmarks
        """
        try:
            print(f"get_monthly_bookmark_data Service community_id: {community_id}")

            # Retrieve bookmarks using the existing method
            bookmarks_response = Bookmark.get_bookmarks_by_community_id(community_id)
            # print(f"bookmarks_response: {bookmarks_response}")

            if not isinstance(bookmarks_response, list):
                return {"result": "error", "message": "Failed to retrieve bookmarks"}
            
            # Initialize a dictionary to count bookmarks per month
            monthly_bookmarks = defaultdict(int)
            
            # Process each bookmark
            for bookmark in bookmarks_response:
                print(f"bookmark: {bookmark}")
                # Extract timestamp
                timestamp = bookmark.get('timestamp')
                
                if timestamp is None:
                    print("Warning: Missing timestamp in bookmark.")
                    continue
                
                if isinstance(timestamp, str):
                    try:
                        # Parse ISO 8601 timestamp
                        timestamp = datetime.fromisoformat(timestamp)
                    except ValueError as ve:
                        print(f"Warning: Failed to parse timestamp '{timestamp}': {ve}")
                        continue
                elif not isinstance(timestamp, datetime):
                    print("Warning: Invalid timestamp format.")
                    continue
                
                # Format the month as 'Jan', 'Feb', etc.
                month = timestamp.strftime('%b')
                # Increment the count for the corresponding month
                monthly_bookmarks[month] += 1
            
            # Ensure all months are represented in the output
            all_months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            bookmarks_data = [{'month': month, 'bookmarks': monthly_bookmarks.get(month, 0)} for month in all_months]
            
            print(f"bookmarks_data: {bookmarks_data}")
            
            return {"result": "success", "data": bookmarks_data}
        
        except Exception as e:
            print(f"Error: {e}")
            return {"result": "error", "message": "service error--" + str(e)}

# SentimentAnalysis
    
    @staticmethod
    def clean_html(content_html):
        """
        Clean HTML content by removing all HTML tags.

        :param content_html: HTML content as a string
        :returns: Text content without HTML tags
        """
        soup = BeautifulSoup(content_html, 'html.parser')
        return soup.get_text()

    @staticmethod
    def analyze_sentiment(text):
        """
        Analyze the sentiment of a given text.

        :param text: Text to analyze
        :returns: Dictionary with sentiment score and magnitude
        """
        blob = TextBlob(text)
        sentiment = blob.sentiment
        return {
            'score': sentiment.polarity,
            'magnitude': sentiment.subjectivity
        }

    @staticmethod
    def get_community_posts_sentiment(community_id):
        """
        Analyze sentiment for community posts and provide trend data.

        :param community_id: ID of the community
        :returns: Dictionary with overall sentiment score and trend data
        """
        try:
            print(f"get_community_posts_sentiment Service community_id: {community_id}")

            # Fetch blog posts and video posts for the community
            print("Fetching blog posts...")
            blog_posts = CommunityAnalysisService.get_posts_by_community_id(community_id)
            print(f"Blog posts fetched: {len(blog_posts)}")

            print("Fetching video posts...")
            video_posts = CommunityAnalysisService.get_video_posts_by_community_id(community_id)
            print(f"Video posts fetched: {len(video_posts)}")

            # Initialize a dictionary to hold sentiment counts per month
            sentiment_data = defaultdict(lambda: {'positive': 0, 'negative': 0, 'neutral': 0})
            sentiment_scores = []

            # Analyze sentiment for all posts
            all_posts = blog_posts + video_posts
            print(f"Total posts to analyze: {len(all_posts)}")
            for post in all_posts:
                content_html = post.get('content', '')
                text = CommunityAnalysisService.clean_html(content_html)
                if text:
                    sentiment = CommunityAnalysisService.analyze_sentiment(text)
                    score = sentiment['score']
                    magnitude = sentiment['magnitude']
                    sentiment_scores.append(score)

                    # Handle the timestamp
                    timestamp = post.get('timestamp', None)
                    month = 'Unknown'
                    
                    if isinstance(timestamp, datetime):
                        month = timestamp.strftime('%b')
                    elif isinstance(timestamp, str):
                        try:
                            # Parse string timestamp to datetime object
                            timestamp = datetime.fromisoformat(timestamp)  # Adjust as needed
                            month = timestamp.strftime('%b')
                        except ValueError:
                            print(f"Invalid timestamp string format: {timestamp}")
                    
                    print(f"Post analyzed - Month: {month}, Score: {score}, Magnitude: {magnitude}")

                    if score >= 0.25:
                        sentiment_data[month]['positive'] += 1
                    elif score <= -0.25:
                        sentiment_data[month]['negative'] += 1
                    else:
                        sentiment_data[month]['neutral'] += 1

            # Calculate overall sentiment score
            # overall_score = sum(sentiment_scores) / len(sentiment_scores) if sentiment_scores else 0
            overall_score = sum(sentiment_scores) if sentiment_scores else 0
            overall_score = round(overall_score, 2)
            print(f"Overall sentiment score calculated: {overall_score}")
            print(f"sum(sentiment_scores): {sum(sentiment_scores)}")
            print(f"len(sentiment_scores): {len(sentiment_scores)}")

            # Ensure all months are represented in the output
            all_months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            sentiment_trend_data = [{'month': month,
                                     'positive': sentiment_data.get(month, {'positive': 0})['positive'],
                                     'negative': sentiment_data.get(month, {'negative': 0})['negative'],
                                     'neutral': sentiment_data.get(month, {'neutral': 0})['neutral']}
                                    for month in all_months]

            print(f"Sentiment results: {sentiment_trend_data}")

            return {"result": "success", "data": {"overallScore": overall_score, "trendData": sentiment_trend_data}}

        except Exception as e:
            print(f"Error occurred: {e}")
            return {"result": "error", "message": "service error--" + str(e)}

# DemographicsInsights

    @staticmethod
    def get_country_code_from_location(location):
        """
        Get the country code from a location string using Google Maps Geocoding API.

        :param location: Location address
        :returns: Country code or 'Unknown' if not found
        """
        api_key = 'AIzaSyC5XsSwdxAj_vrjLI4HqYiMzmgQ9YxlpBE'  # Replace with your Google API Key
        base_url = 'https://maps.googleapis.com/maps/api/geocode/json'
        
        print(f"Geocoding location: {location}")
        
        try:
            # Request parameters
            params = {
                'address': location,
                'key': api_key
            }
            print(f"Request parameters: {params}")
            
            # Make the request to the Google Maps Geocoding API
            response = requests.get(base_url, params=params)
            print(f"HTTP response status code: {response.status_code}")
            response_data = response.json()
            print(f"Response data: {response_data}")
            
            # Check if the response is successful
            if response_data['status'] == 'OK':
                results = response_data['results'][0]
                print(f"Geocoding results: {results}")
                address_components = results['address_components']
                
                # Loop through address components to find the country code
                for component in address_components:
                    print(f"Address component: {component}")
                    if 'country' in component['types']:
                        country_code = component.get('short_name', 'Unknown')
                        print(f"Found country code: {country_code}")
                        return country_code
            
            # Return 'Unknown' if no valid country code is found
            print(f"No valid country code found for location: {location}")
            return 'Unknown'
        
        except Exception as e:
            print(f"Error in geocoding: {e}")
            return "Unknown"

    @staticmethod
    def get_continent_from_country_code(country_code):
        """
        Get the continent from a country code using Restcountries API.

        :param country_code: Country code (e.g., 'US')
        :returns: Continent name or 'Unknown' if not found
        """
        restcountries_url = 'https://restcountries.com/v3.1/all'
        
        print(f"Fetching continent for country code: {country_code}")
        
        try:
            response = requests.get(restcountries_url)
            response.raise_for_status()  # Raise an error for bad HTTP status
            countries = response.json()
            
            for country in countries:
                if country.get('cca2') == country_code:
                    # Get the first continent from the 'continents' field if available
                    continents = country.get('continents', [])
                    if continents:
                        continent = continents[0]
                        print(f"Found continent: {continent}")
                        return continent
                    else:
                        print("No continent data available.")
                        return 'Unknown'
            
            return 'Unknown'
        
        except Exception as e:
            print(f"Error in fetching continent data: {e}")
            return 'Unknown'
    
    @staticmethod
    def get_continent_from_location(location):
        """
        Get the continent from a location string.

        :param location: Location address
        :returns: Continent name or 'Unknown' if not found
        """
        country_code = CommunityAnalysisService.get_country_code_from_location(location)
        if country_code == 'Unknown':
            return 'Unknown'
        
        continent = CommunityAnalysisService.get_continent_from_country_code(country_code)
        return continent

    @staticmethod
    def get_demographic_insights(community_id):
        """
        Retrieve demographic insights for a community based on member locations and pronouns.

        :param community_id: ID of the community
        :returns: Dictionary with location distribution and pronouns distribution
        """
        try:
            print(f"Starting demographic insights for community_id: {community_id}")

            # Retrieve the community by ID
            community = Community.get_community_by_id(community_id)
            print(f"Community retrieved: {community}")

            if not community:
                print("Community not found")
                return {"result": "error", "message": "Community not found"}

             # Get the list of member user IDs and add admin ID
            member_ids = set(community.community_members_list)  # Use a set to avoid duplicates
            admin_id = community.admin
            if admin_id:
                member_ids.add(admin_id)
            
            print(f"Member IDs including admin: {member_ids}")

            # Fetch user details for each member including admin
            users = User.get_users_by_ids(list(member_ids))
            print(f"Users fetched: {users}")

            # Fixed location distribution
            fixed_location_distribution = [
                { "location": 'North America', "count": 0 },
                { "location": 'Europe', "count": 0 },
                { "location": 'Asia', "count": 0 },
                { "location": 'Africa', "count": 0 },
                { "location": 'South America', "count": 0 },
                { "location": 'Oceania', "count": 0 },
                { "location": 'Antarctica', "count": 0 }
            ]

            # Create a dictionary for quick lookup
            location_dict = {loc["location"]: loc for loc in fixed_location_distribution}

            # Initialize counters for pronouns
            pronouns_distribution = defaultdict(int)

            # Process each user
            for user in users:
                print(f"Processing user: {user}")
                # Determine the continent from location
                continent = CommunityAnalysisService.get_continent_from_location(user.location)
                print(f"User {user.username} location: {user.location}, Continent: {continent}")
                # Update count if continent is in the fixed list
                if continent in location_dict:
                    location_dict[continent]["count"] += 1
                # Count pronouns
                pronouns_distribution[user.pronouns] += 1

            print(f"Location distribution: {location_dict}")
            print(f"Pronouns distribution: {pronouns_distribution}")

            # Convert the results into list format
            location_distribution_list = list(location_dict.values())
             # Exclude empty or null pronouns
            pronouns_distribution_list = [
                {"pronouns": pron, "count": count}
                for pron, count in pronouns_distribution.items()
                if pron
            ]

            # Return the data
            print("Returning data")
            return {
                "result": "success",
                "data": {
                    "locationDistribution": location_distribution_list,
                    "pronounsDistribution": pronouns_distribution_list,
                }
            }

        except Exception as e:
            print(f"Error encountered: {e}")
            return {"result": "error", "message": "service error--" + str(e)}

