from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()


def create_app():
    app = Flask(__name__)

    app.config['JSON_AS_ASCII'] = False
    app.secret_key = os.getenv("SECRET_KEY", "iter-dev-secret-key")

    app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
    app.config['SESSION_COOKIE_SECURE'] = False
    # app.config['SESSION_COOKIE_DOMAIN'] = '127.0.0.1'

    CORS(
        app,
        origins=["http://localhost:5173"],
        supports_credentials=True
    )

    from app.routes import main
    app.register_blueprint(main)

    return app