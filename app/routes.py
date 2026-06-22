from flask import Blueprint, jsonify, request, redirect, session, url_for
from app import supabase
from functools import wraps
import anthropic
import os

main = Blueprint('main', __name__)

# 로그인 필요한 페이지 데코레이터
def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'user' not in session:
            return redirect(url_for('main.login'))
        return f(*args, **kwargs)
    return decorated

# 랜딩
@main.route('/')
def index():
    return jsonify({"page": "랜딩 페이지"})

# 회원가입 페이지
@main.route('/signup')
def signup_page():
    #return render_template('signup.html')
    return jsonify({"page": "회원가입 페이지"})

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
            "redirect_to": "http://127.0.0.1:5000/auth/callback"
        }
    })
    return redirect(res.url)

# 콜백 → 세션 저장
@main.route('/auth/callback')
def callback():
    code = request.args.get('code')
    if code:
        res = supabase.auth.exchange_code_for_session({"auth_code": code})
        session['user'] = {
            "id": res.user.id,
            "email": res.user.email,
            "name": res.user.user_metadata.get('full_name', '')
        }
        return redirect(url_for('main.profile'))
    return redirect(url_for('main.login'))

# 대시보드
@main.route('/dashboard')
@login_required
def dashboard():
    return jsonify({"page": "대시보드", "user": session['user']})


# 로그아웃
@main.route('/auth/logout', methods=['POST'])
def logout():
    session.clear()
    supabase.auth.sign_out()
    return redirect(url_for('main.login'))



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
            "options": {
                "data": {"full_name": name}
            }
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
        session['user'] = {
            "id": res.user.id,
            "email": res.user.email,
            "name": res.user.user_metadata.get('full_name', '')
        }
        return jsonify({"message": "로그인 성공!", "user": session['user']}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
    
    
    
# 프로필 조회
@main.route('/profile')
@login_required
def profile():
    user_id = session['user']['id']
    
    try:
        res = supabase.table('user_profiles').select('*').eq('user_id', user_id).single().execute()
        return jsonify({
            "page": "명함 페이지",
            "user": session['user'],
            "profile": res.data
        })
    except:
        return jsonify({
            "page": "명함 페이지",
            "user": session['user'],
            "profile": None
        })

# 프로필 저장/수정
@main.route('/profile/save', methods=['POST'])
@login_required
def profile_save():
    user_id = session['user']['id']
    data = request.get_json()
    
    profile_data = {
        "user_id": user_id,
        "languages": data.get('languages', []),
        "school": data.get('school', ''),
        "department": data.get('department', ''),
        "github_url": data.get('github_url', ''),
        "resume_url": data.get('resume_url', ''),
        "contact": data.get('contact', ''),
        "bio_sentence": data.get('bio_sentence', '')
    }
    
    try:
        # 이미 있으면 수정, 없으면 생성
        existing = supabase.table('user_profiles').select('id').eq('user_id', user_id).execute()
        
        if existing.data:
            supabase.table('user_profiles').update(profile_data).eq('user_id', user_id).execute()
        else:
            supabase.table('user_profiles').insert(profile_data).execute()
            
        return jsonify({"message": "프로필 저장 성공!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
    
# 경험 전체 조회
@main.route('/experiences')
@login_required
def experiences():
    user_id = session['user']['id']
    
    try:
        res = supabase.table('experiences').select('*').eq('user_id', user_id).execute()
        return jsonify({
            "page": "경험 모두보기",
            "experiences": res.data
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# 경험 상세 조회
@main.route('/experiences/<experience_id>')
@login_required
def experience_detail(experience_id):
    user_id = session['user']['id']
    
    try:
        res = supabase.table('experiences').select('*').eq('id', experience_id).eq('user_id', user_id).single().execute()
        return jsonify({"experience": res.data})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# 경험 추가
@main.route('/experiences/add', methods=['POST'])
@login_required
def experiences_add():
    user_id = session['user']['id']
    data = request.get_json()
    
    experience_data = {
        "user_id": user_id,
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
@login_required
def experience_edit(experience_id):
    user_id = session['user']['id']
    data = request.get_json()
    
    try:
        res = supabase.table('experiences').update(data).eq('id', experience_id).eq('user_id', user_id).execute()
        return jsonify({"message": "경험 수정 성공!", "experience": res.data[0]}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# 경험 삭제
@main.route('/experiences/<experience_id>/delete', methods=['POST'])
@login_required
def experience_delete(experience_id):
    user_id = session['user']['id']
    
    try:
        supabase.table('experiences').delete().eq('id', experience_id).eq('user_id', user_id).execute()
        return jsonify({"message": "경험 삭제 성공!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# ── AI 세션 ──────────────────────────────────────────

FIELD_LABELS = {
    "role": "역할",
    "background": "배경",
    "action": "액션",
    "result": "결과",
    "learned": "배운 점",
    "reflection": "느낀 점",
    "memo": "기타 메모",
}

def build_experience_summary(exp: dict) -> str:
    lines = []
    for key, label in FIELD_LABELS.items():
        val = exp.get(key, "").strip()
        if val:
            lines.append(f"[{label}] {val}")
    return "\n".join(lines) if lines else "(아직 작성된 내용이 없어요)"

AI_SYSTEM_PROMPT = """당신은 ITER AI입니다. 사용자가 자신의 경험을 더 풍부하게 기록할 수 있도록 돕는 인터뷰어예요.

핵심 원칙:
- 짧고 따뜻하게, 해요체로 말해요
- 한 번에 한 가지 질문만 해요
- 글은 절대 대신 써주지 않아요 — 질문으로 스스로 떠올리게 도와요
- 비어있는 항목(배경, 결과, 배운 점, 느낀 점)을 우선 채울 수 있도록 유도해요
- "배경 부분이 조금 더 구체적이면 좋겠어요." 처럼 밑줄 강조가 필요한 핵심 문구는 **별표**로 감싸요

대화 흐름:
1. 작성된 내용 중 인상적인 부분 짧게 언급
2. 비어있거나 더 깊이 파고들 수 있는 항목에 대해 질문
3. 사용자 답변을 듣고 -> 공감 -> 다음 질문"""


@main.route('/ai/session/start', methods=['POST'])
def ai_session_start():
    data = request.get_json()
    experience = data.get('experience', {})
    summary = build_experience_summary(experience)

    client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
    msg = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=512,
        system=AI_SYSTEM_PROMPT,
        messages=[{
            "role": "user",
            "content": f"사용자가 작성한 경험 내용이에요:\n{summary}\n\n첫 인사와 함께 대화를 시작해주세요."
        }]
    )
    return jsonify({"message": msg.content[0].text})


@main.route('/ai/session/chat', methods=['POST'])
def ai_session_chat():
    data = request.get_json()
    user_message = data.get('message', '')
    experience = data.get('experience', {})
    history = data.get('history', [])

    summary = build_experience_summary(experience)

    # 대화 히스토리 변환
    claude_messages = []
    for msg in history:
        role = "assistant" if msg['role'] == 'ai' else "user"
        claude_messages.append({"role": role, "content": msg['text']})
    claude_messages.append({"role": "user", "content": user_message})

    system = f"{AI_SYSTEM_PROMPT}\n\n현재 사용자의 경험 기록:\n{summary}"

    client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
    msg = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=512,
        system=system,
        messages=claude_messages,
    )
    return jsonify({"message": msg.content[0].text})