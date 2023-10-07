import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    FLASK_SECRETKEY = os.environ.get("FLASK_SECRETKEY")