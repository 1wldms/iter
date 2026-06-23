from flask import Blueprint, jsonify, request, redirect
from app.supabase_client import supabase
import os
import json
from app.ai_prompts import (
    get_next_empty_field,
    build_session_messages,
    build_keyword_extraction_messages,
    is_tip_request,
    FIELD_TIPS,
)
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


main = Blueprint('main', __name__)

def get_user_from_token(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return None
    token = auth_header.replace('Bearer ', '')
    try:
        user = supabase.auth.get_user(token)
        return user.user
    except:
        return None

def call_gpt(system: str, messages: list) -> dict:     
    full_messages = [{"role": "system", "content": system}] + messages
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=full_messages,
        response_format={"type": "json_object"},
    )
    raw = response.choices[0].message.content
    return json.loads(raw)

# 랜딩
@main.route('/')
def index():
    return jsonify({"page": "랜딩 페이지"})

# 로그인 페이지
@main.route('/login')
def login():
    return jsonify({"page": "로그인 페이지"})

# Google 로그인
@main.route('/auth/google')
def google_login():
    res = supabase.auth.sign_in_with_oauth({
        "provider": "google",
        "options": {
            "redirect_to": "http://127.0.0.1:5001/auth/callback"
        }
    })
    return redirect(res.url)

# Google 콜백
@main.route('/auth/callback')
def callback():
    code = request.args.get('code')
    if code:
        try:
            res = supabase.auth.exchange_code_for_session({"auth_code": code})
            token = res.session.access_token
            return redirect(f"http://localhost:5173/profile?token={token}")
        except Exception as e:
            return redirect("http://localhost:5173/login")
    return redirect("http://localhost:5173/login")

# 이메일 회원가입
@main.route('/auth/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    try:
        res = supabase.auth.sign_up({
            "email": email,
            "password": password,
            "options": {"data": {"full_name": name}}
        })
        return jsonify({"message": "회원가입 성공! 이메일 인증을 확인해주세요.", "email": email}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# 이메일 로그인
@main.route('/auth/login', methods=['POST'])
def email_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    try:
        res = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        return jsonify({
            "message": "로그인 성공!",
            "access_token": res.session.access_token,
            "user": {
                "id": res.user.id,
                "email": res.user.email,
                "name": res.user.user_metadata.get('full_name', '')
            }
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# 로그아웃
@main.route('/auth/logout', methods=['POST'])
def logout():
    return jsonify({"message": "로그아웃 성공"}), 200

# 프로필 조회
@main.route('/profile')
def profile():
    user = get_user_from_token(request)
    if not user:
        return jsonify({"error": "unauthorized"}), 401
    try:
        res = supabase.table('user_profiles').select('*').eq('user_id', user.id).single().execute()
        profile_data = res.data
    except:
        profile_data = None
    return jsonify({
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.user_metadata.get('full_name', '')
        },
        "profile": profile_data
    })

# 프로필 저장/수정
@main.route('/profile/save', methods=['POST'])
def profile_save():
    user = get_user_from_token(request)
    if not user:
        return jsonify({"error": "unauthorized"}), 401
    data = request.get_json()
    profile_data = {
        "user_id": user.id,
        "languages": data.get('languages', []),
        "school": data.get('school', ''),
        "department": data.get('department', ''),
        "github_url": data.get('github_url', ''),
        "resume_url": data.get('resume_url', ''),
        "contact": data.get('contact', ''),
        "bio_sentence": data.get('bio_sentence', '')
    }
    try:
        existing = supabase.table('user_profiles').select('id').eq('user_id', user.id).execute()
        if existing.data:
            supabase.table('user_profiles').update(profile_data).eq('user_id', user.id).execute()
        else:
            supabase.table('user_profiles').insert(profile_data).execute()
        return jsonify({"message": "프로필 저장 성공!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# 경험 전체 조회
@main.route('/experiences')
def experiences():
    user = get_user_from_token(request)
    if not user:
        return jsonify({"error": "unauthorized"}), 401
    try:
        res = supabase.table('experiences').select('*').eq('user_id', user.id).order('created_at', desc=True).execute()
        return jsonify({"experiences": res.data})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# 경험 상세 조회
@main.route('/experiences/<experience_id>')
def experience_detail(experience_id):
    user = get_user_from_token(request)
    if not user:
        return jsonify({"error": "unauthorized"}), 401
    try:
        res = supabase.table('experiences').select('*').eq('id', experience_id).eq('user_id', user.id).single().execute()
        return jsonify({"experience": res.data})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# 경험 추가
@main.route('/experiences/add', methods=['POST'])
def experiences_add():
    user = get_user_from_token(request)
    if not user:
        return jsonify({"error": "unauthorized"}), 401
    data = request.get_json()
    experience_data = {
        "user_id": user.id,
        "title": data.get('title', ''),
        "role": data.get('role', ''),
        "background": data.get('background', ''),
        "action": data.get('action', ''),
        "result": data.get('result', ''),
        "learned": data.get('learned', ''),
        "reflection": data.get('reflection', ''),
        "memo": data.get('memo', ''),
        "keywords": data.get('keywords', [])
    }
    try:
        res = supabase.table('experiences').insert(experience_data).execute()
        return jsonify({"message": "경험 추가 성공!", "experience": res.data[0]}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# 경험 수정
@main.route('/experiences/<experience_id>/edit', methods=['POST'])
def experience_edit(experience_id):
    user = get_user_from_token(request)
    if not user:
        return jsonify({"error": "unauthorized"}), 401
    data = request.get_json()
    try:
        res = supabase.table('experiences').update(data).eq('id', experience_id).eq('user_id', user.id).execute()
        return jsonify({"message": "경험 수정 성공!", "experience": res.data[0]}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# 경험 삭제
@main.route('/experiences/<experience_id>/delete', methods=['POST'])
def experience_delete(experience_id):
    user = get_user_from_token(request)
    if not user:
        return jsonify({"error": "unauthorized"}), 401
    try:
        supabase.table('experiences').delete().eq('id', experience_id).eq('user_id', user.id).execute()
        return jsonify({"message": "경험 삭제 성공!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
# AI 세션 시작
@main.route('/ai/session/start', methods=['POST'])
def ai_session_start():
    user = get_user_from_token(request)
    if not user:
        return jsonify({"error": "unauthorized"}), 401

    data = request.get_json()
    fields = data.get('experience', {})

    next_field = get_next_empty_field(fields)
    # next_field가 None이어도 그냥 진행 (깊게 파고들기 모드)

    system, messages = build_session_messages(fields, [], next_field)

    try:
        result = call_gpt(system, messages)
    except Exception as e:
        return jsonify({"error": "AI 호출 실패", "detail": str(e)}), 500

    return jsonify({
        "message": result["message"],
        "suggestions": result.get("suggestions", []),
        "target_field": next_field,
        "is_complete": False,
    }), 200

# AI 세션 채팅
@main.route('/ai/session/chat', methods=['POST'])
def ai_session_chat():
    user = get_user_from_token(request)
    if not user:
        return jsonify({"error": "unauthorized"}), 401

    data = request.get_json()
    fields = data.get('experience', {})
    history = data.get('history', [])
    user_message = data.get('message', '')
    target_field = data.get('target_field')

    if not target_field:
        target_field = get_next_empty_field(fields)

    if is_tip_request(user_message):
        return jsonify({
            "message": FIELD_TIPS.get(
                target_field,
                "현재 항목을 작성할 때는 구체적인 경험과 사례를 떠올려보세요."
            ),
            "suggestions": [],
            "target_field": target_field,
            "is_complete": False,
        }), 200

    if target_field is None:
        return jsonify({
            "message": "이제 다 모인 것 같아요~ 저장해볼까요?",
            "suggestions": [],
            "target_field": None,
            "is_complete": True,
        }), 200

    gpt_history = [
        {"role": "assistant" if h.get("role") == "ai" else "user", "content": h.get("text", "")}
        for h in history
    ]

    system, messages = build_session_messages(fields, gpt_history, target_field, user_message=user_message)

    try:
        result = call_gpt(system, messages)
    except Exception as e:
        return jsonify({"error": "AI 호출 실패", "detail": str(e)}), 500

    # 다음 질문할 항목은 사용자가 실제로 칸을 채운 뒤 프론트가 다시 보내줄 fields 기준으로 정해짐.
    # 지금 이 응답에서는 같은 target_field에 대한 "제안"을 주는 것이므로 target_field 유지.
    return jsonify({
        "message": result["message"],
        "suggestions": result.get("suggestions", []),
        "target_field": target_field,
        "is_complete": False,
    }), 200