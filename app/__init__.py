from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os
from supabase import create_client

load_dotenv()

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_KEY")
)

def create_app():
    app = Flask(__name__)
    app.config['JSON_AS_ASCII'] = False
    app.secret_key = os.getenv("SECRET_KEY", "iter-dev-secret-key")
    
    # 세션 쿠키 크로스 도메인 허용
    app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
    app.config['SESSION_COOKIE_SECURE'] = False
    app.config['SESSION_COOKIE_DOMAIN'] = '127.0.0.1'

    CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

    from app.routes import main
    app.register_blueprint(main)

    return app