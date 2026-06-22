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
    app.secret_key = 'iter-secret-key-change-this-later'

    CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

    from app.routes import main
    app.register_blueprint(main)

    return app