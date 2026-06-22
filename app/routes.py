from flask import Blueprint, jsonify, request, redirect, session, url_for
from app import supabase
from functools import wraps

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