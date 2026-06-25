from flask import Blueprint, jsonify, request, redirect
print("routes: flask imported")
from app.supabase_client import supabase
print("routes: supabase imported")
import os
import json
print("routes: os/json imported")
from app.ai_prompts import (
    get_next_empty_field,
    build_session_messages,
    build_summary_messages,
    build_keyword_extraction_messages,
    EXPERIENCE_FIELDS,
)
print("routes: ai_prompts imported")
from openai import OpenAI
print("routes: openai imported")

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
BACKEND_URL = os.getenv("BACKEND_URL", "http://127.0.0.1:5001")

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
            "redirect_to": f"{BACKEND_URL}/auth/callback"
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
            return redirect(f"{FRONTEND_URL}/profile?token={token}")
        except Exception as e:
            return redirect(f"{FRONTEND_URL}/login")
    return redirect(f"{FRONTEND_URL}/login")

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
            "name": profile_data.get('name', '') if profile_data else user.user_metadata.get('full_name', '')
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
        "name": data.get('name', ''), 
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

# bio_sentence만 업데이트 (Insights에서 호출)
@main.route('/profile/update', methods=['POST'])
def profile_update():
    user = get_user_from_token(request)
    if not user:
        return jsonify({"error": "unauthorized"}), 401
    data = request.get_json()
    update_data = {}
    if 'bio_sentence' in data:
        update_data['bio_sentence'] = data['bio_sentence']
    if not update_data:
        return jsonify({"error": "업데이트할 내용이 없어요"}), 400
    try:
        existing = supabase.table('user_profiles').select('id').eq('user_id', user.id).execute()
        if existing.data:
            supabase.table('user_profiles').update(update_data).eq('user_id', user.id).execute()
        else:
            supabase.table('user_profiles').insert({"user_id": user.id, **update_data}).execute()
        return jsonify({"message": "업데이트 성공!"}), 200
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

    fields = {
        "title": data.get('title', ''),
        "role": data.get('role', ''),
        "background": data.get('background', ''),
        "action": data.get('action', ''),
        "result": data.get('result', ''),
        "learned": data.get('learned', ''),
        "reflection": data.get('reflection', ''),
        "memo": data.get('memo', ''),
    }

    try:
        system, messages = build_keyword_extraction_messages(fields)
        result = call_gpt(system, messages)
        keywords = result.get("keywords", [])
    except Exception as e:
        print("키워드 추출 실패:", e)
        keywords = []

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
        "keywords": keywords,
        "start_date": data.get('start_date') or None,
        "end_date": data.get('end_date') or None,
    }

    try:
        res = supabase.table('experiences').insert(experience_data).execute()
        return jsonify({
            "message": "경험 추가 성공!",
            "experience": res.data[0]
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400

# 경험 수정
@main.route('/experiences/<experience_id>/edit', methods=['POST'])
def experience_edit(experience_id):
    user = get_user_from_token(request)
    if not user:
        return jsonify({"error": "unauthorized"}), 401
    data = request.get_json()

    # 빈 문자열 날짜를 None으로 변환 (DATE 컬럼 에러 방지)
    if data.get('start_date') == '':
        data['start_date'] = None
    if data.get('end_date') == '':
        data['end_date'] = None

    # 키워드 재추출
    try:
        system, messages = build_keyword_extraction_messages(data)
        result = call_gpt(system, messages)
        data["keywords"] = result.get("keywords", [])
    except Exception as e:
        print("키워드 추출 실패:", e)

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
        supabase.table('experiences')\
            .delete()\
            .eq('id', experience_id)\
            .eq('user_id', user.id)\
            .execute()

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
    target_field = data.get('target_field') or get_next_empty_field(fields)

    if not target_field:
        target_field = list(EXPERIENCE_FIELDS.keys())[0]

    system, messages = build_session_messages(fields, [], target_field)

    try:
        result = call_gpt(system, messages)
    except Exception as e:
        return jsonify({"error": "AI 호출 실패", "detail": str(e)}), 500

    return jsonify({
        "message": result["message"],
        "suggestions": [],
        "target_field": target_field,
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
    
@main.route('/ai/session/summarize', methods=['POST'])
def ai_session_summarize():
    user = get_user_from_token(request)
    if not user:
        return jsonify({"error": "unauthorized"}), 401

    data = request.get_json()
    fields = data.get('experience', {})
    history = data.get('history', [])
    target_field = data.get('target_field')

    if not target_field:
        return jsonify({"error": "target_field 없음"}), 400

    from app.ai_prompts import build_summary_messages
    system, messages = build_summary_messages(fields, history, target_field)

    try:
        result = call_gpt(system, messages)
    except Exception as e:
        return jsonify({"error": "AI 호출 실패", "detail": str(e)}), 500

    return jsonify({"summary": result.get("summary", "")}), 200

# 폴더 목록 조회
@main.route('/folders')
def folders_list():
    user = get_user_from_token(request)
    if not user:
        return jsonify({"error": "unauthorized"}), 401
    try:
        res = supabase.table('folders').select('*').eq('user_id', user.id).order('created_at').execute()
        return jsonify({"folders": res.data})
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# 폴더 추가
@main.route('/folders/add', methods=['POST'])
def folders_add():
    user = get_user_from_token(request)
    if not user:
        return jsonify({"error": "unauthorized"}), 401
    data = request.get_json()
    name = data.get('name', '').strip()
    if not name:
        return jsonify({"error": "폴더 이름이 필요해요"}), 400
    try:
        res = supabase.table('folders').insert({"user_id": user.id, "name": name}).execute()
        return jsonify({"message": "폴더 생성 성공!", "folder": res.data[0]}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# 폴더 이름 수정
@main.route('/folders/<folder_id>/edit', methods=['POST'])
def folders_edit(folder_id):
    user = get_user_from_token(request)
    if not user:
        return jsonify({"error": "unauthorized"}), 401
    data = request.get_json()
    name = data.get('name', '').strip()
    if not name:
        return jsonify({"error": "폴더 이름이 필요해요"}), 400
    try:
        res = supabase.table('folders').update({"name": name}).eq('id', folder_id).eq('user_id', user.id).execute()
        return jsonify({"message": "폴더 이름 수정 성공!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# 폴더 삭제
@main.route('/folders/<folder_id>/delete', methods=['POST'])
def folders_delete(folder_id):
    user = get_user_from_token(request)
    if not user:
        return jsonify({"error": "unauthorized"}), 401
    try:
        # 그 폴더에 속한 경험들은 "분류 안 됨" 상태로 되돌림
        supabase.table('experiences').update({"folder_id": None}).eq('folder_id', folder_id).eq('user_id', user.id).execute()
        supabase.table('folders').delete().eq('id', folder_id).eq('user_id', user.id).execute()
        return jsonify({"message": "폴더 삭제 성공!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# 경험을 폴더로 이동
@main.route('/experiences/<experience_id>/move', methods=['POST'])
def experience_move(experience_id):
    user = get_user_from_token(request)
    if not user:
        return jsonify({"error": "unauthorized"}), 401
    data = request.get_json()
    folder_id = data.get('folder_id')  # null이면 "분류 안 됨"으로 이동
    try:
        res = supabase.table('experiences').update({"folder_id": folder_id}).eq('id', experience_id).eq('user_id', user.id).execute()
        return jsonify({"message": "이동 성공!", "experience": res.data[0]}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# ── Insights: 강점 AI 분석 ──────────────────────────────────
@main.route('/insights/strengths', methods=['POST'])
def insights_strengths():
    user = get_user_from_token(request)
    if not user:
        return jsonify({"error": "unauthorized"}), 401
    try:
        res = supabase.table('experiences').select('learned, reflection, action, role').eq('user_id', user.id).execute()
        exps = res.data
        if not exps:
            return jsonify({"strength": "아직 경험이 없어요. 경험을 기록하고 나면 강점을 분석해드릴게요!", "keywords": []}), 200

        combined = "\n\n".join([
            f"[역할: {e.get('role','?')}]\n배운점: {e.get('learned','')}\n느낀점: {e.get('reflection','')}\n액션: {e.get('action','')}"
            for e in exps if e.get('learned') or e.get('reflection')
        ])
        if not combined.strip():
            return jsonify({"strength": "배운점과 느낀점을 채워주시면 강점을 분석해드릴 수 있어요!", "keywords": []}), 200

        system = (
            "당신은 커리어 코치입니다. 사용자의 여러 경험에서 공통된 강점과 패턴을 찾아 "
            "한국어로 2~3문장으로 따뜻하고 명확하게 요약해주세요. "
            "반드시 JSON만 반환: {\"strength\": \"...\", \"keywords\": [\"강점1\", \"강점2\", \"강점3\"]}"
        )
        messages = [{"role": "user", "content": combined}]
        result = call_gpt(system, messages)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
    
# ── Bio 후보 목록 조회 ──────────────────────────────────────
@main.route('/bio-candidates', methods=['GET'])
def bio_candidates_list():
    user = get_user_from_token(request)
    if not user:
        return jsonify({"error": "unauthorized"}), 401
    try:
        res = supabase.table('bio_candidates').select('*').eq('user_id', user.id).order('created_at', desc=True).execute()
        return jsonify({"candidates": res.data}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# ── Bio 후보 추가 ────────────────────────────────────────────
@main.route('/bio-candidates/add', methods=['POST'])
def bio_candidates_add():
    user = get_user_from_token(request)
    if not user:
        return jsonify({"error": "unauthorized"}), 401
    data = request.get_json()
    content = data.get('content', '').strip()
    if not content:
        return jsonify({"error": "내용이 없어요"}), 400
    try:
        res = supabase.table('bio_candidates').insert({
            "user_id": user.id,
            "content": content,
            "is_selected": False,
        }).execute()
        return jsonify({"message": "저장 성공!", "candidate": res.data[0]}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# ── Bio 후보 수정 ────────────────────────────────────────────
@main.route('/bio-candidates/<candidate_id>/edit', methods=['POST'])
def bio_candidates_edit(candidate_id):
    user = get_user_from_token(request)
    if not user:
        return jsonify({"error": "unauthorized"}), 401
    data = request.get_json()
    content = data.get('content', '').strip()
    if not content:
        return jsonify({"error": "내용이 없어요"}), 400
    try:
        res = supabase.table('bio_candidates').update({"content": content}).eq('id', candidate_id).eq('user_id', user.id).execute()
        return jsonify({"message": "수정 성공!", "candidate": res.data[0]}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# ── Bio 후보 삭제 ────────────────────────────────────────────
@main.route('/bio-candidates/<candidate_id>/delete', methods=['POST'])
def bio_candidates_delete(candidate_id):
    user = get_user_from_token(request)
    if not user:
        return jsonify({"error": "unauthorized"}), 401
    try:
        supabase.table('bio_candidates').delete().eq('id', candidate_id).eq('user_id', user.id).execute()
        return jsonify({"message": "삭제 성공!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# ── Bio 후보 선택 (Card에 반영) ──────────────────────────────
@main.route('/bio-candidates/<candidate_id>/select', methods=['POST'])
def bio_candidates_select(candidate_id):
    user = get_user_from_token(request)
    if not user:
        return jsonify({"error": "unauthorized"}), 401
    try:
        # 기존 선택 해제
        supabase.table('bio_candidates').update({"is_selected": False}).eq('user_id', user.id).execute()
        # 선택한 후보 선택 처리
        res = supabase.table('bio_candidates').update({"is_selected": True}).eq('id', candidate_id).eq('user_id', user.id).execute()
        selected_content = res.data[0]['content']
        # profile bio_sentence에도 반영
        existing = supabase.table('user_profiles').select('id').eq('user_id', user.id).execute()
        if existing.data:
            supabase.table('user_profiles').update({"bio_sentence": selected_content}).eq('user_id', user.id).execute()
        else:
            supabase.table('user_profiles').insert({"user_id": user.id, "bio_sentence": selected_content}).execute()
        return jsonify({"message": "선택 성공!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400