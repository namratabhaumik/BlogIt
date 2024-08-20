import os
import firebase_admin
from firebase_admin import credentials, messaging

# Get the directory of the current script
base_dir = os.path.dirname(os.path.abspath(__file__))

# Construct the correct relative path to the Firebase Admin SDK JSON file
json_path = os.path.join(base_dir, '..', 'config', 'firebase-adminsdk.json')

# Initialize the Firebase Admin SDK with the credentials from the JSON file
try:
    cred = credentials.Certificate(json_path)
    firebase_admin.initialize_app(cred)
except Exception as e:
    print(f"Error initializing Firebase Admin SDK: {e}")


def send_notification_to_user(token, title, body):
    """
    Sends a notification to a specific user identified by the token.

    Args:
        token (str): The device token of the user.
        title (str): The title of the notification.
        body (str): The body content of the notification.
    """
    try:
        message = messaging.Message(
            notification=messaging.Notification(
                title=title,
                body=body
            ),
            token=token,
        )
        # Send the message and capture the response
        response = messaging.send(message)
        print('Successfully sent message:', response)
    except Exception as e:
        print(f"Error sending notification: {e}")
