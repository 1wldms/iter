from flask import Blueprint, jsonify, request, redirect
from app import supabase

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return jsonify({"message": "서버 연결 성공!"})

# 이메일 회원가입
@main.route('/auth/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    try:
        res = supabase.auth.sign_up({
            "email": email,
            "password": password
        })
        return jsonify({"message": "회원가입 성공!", "user": res.user.email}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# 이메일 로그인
@main.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    try:
        res = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        return jsonify({"message": "로그인 성공!", "user": res.user.email}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Google 로그인
@main.route('/auth/google')
def google_login():
    res = supabase.auth.sign_in_with_oauth({
        "provider": "google",
        "options": {
            "redirect_to": "http://127.0.0.1:5000/auth/callback"  # 수정
        }
    })
    return redirect(res.url)

# 로그인 후 콜백
@main.route('/auth/callback')
def callback():
    return jsonify({"message": "로그인 성공!"})

# 로그아웃
@main.route('/auth/logout', methods=['POST'])
def logout():
    supabase.auth.sign_out()
    return jsonify({"message": "로그아웃 성공!"})