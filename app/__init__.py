from flask import Flask
from config.config import Config

config = Config()

# Create the Flask app instance
app = Flask(__name__)

# Configuration settings (optional)
app.config['SECRET_KEY'] = config.FLASK_SECRETKEY

# Import the routes and views
from app import routes
