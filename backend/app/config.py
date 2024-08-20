import os

class Config:
    # General Config
    DEBUG = os.environ.get('FLASK_DEBUG', 'True') == 'True'

    # MongoDB Config
    MONGO_URI = os.environ.get('MONGO_URI', 'mongodb+srv://blogit:blogit.5709@blogit.brakffi.mongodb.net/blogit?retryWrites=true&w=majority&appName=blogit')
    DATABASE_NAME = 'blogit'

    # Optional: MongoDB Client Settings
    MONGO_DBNAME = os.environ.get('MONGO_DBNAME', 'blogit')
    MONGO_USERNAME = os.environ.get('MONGO_USERNAME', 'blogit')
    MONGO_PASSWORD = os.environ.get('MONGO_PASSWORD', 'blogit.5709')
