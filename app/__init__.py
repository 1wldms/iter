from flask import Flask
from dotenv import load_dotenv
import os
from supabase import create_client

load_dotenv()

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

def create_app():
    app = Flask(__name__)
    app.config['JSON_AS_ASCII'] = False  # ← 이 줄 추가
    
    from app.routes import main
    app.register_blueprint(main)
    
    return app