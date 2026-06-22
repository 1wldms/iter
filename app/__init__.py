from flask import Flask
from dotenv import load_dotenv
import os
from supabase import create_client

load_dotenv()

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_KEY")  # service_role 키로 변경
)

def create_app():
    app = Flask(__name__)
    app.config['JSON_AS_ASCII'] = False
    app.secret_key = 'iter-secret-key-change-this-later'
    
    from app.routes import main
    app.register_blueprint(main)
    
    return app