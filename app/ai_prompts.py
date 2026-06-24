EXPERIENCE_FIELDS = {
    "title":      {"label": "제목",  "guide": "이 경험을 한 문장으로 표현한 제목"},
    "role":       {"label": "역할",  "guide": "프로젝트에서 나의 포지션"},
    "background": {"label": "배경",  "guide": "어떤 계기나 이유로 시작했는지"},
    "action":     {"label": "액션",  "guide": "진행을 위해 직접 한 행동들"},
    "result":     {"label": "결과",  "guide": "이 경험에서 나온 결과"},
    "learned":    {"label": "배운점", "guide": "성격이든 스킬이든 향상된 부분"},
    "reflection": {"label": "느낀점", "guide": "기억된 방식, 그때의 감정"},
    "memo":       {"label": "기타",  "guide": "카테고리에 안 맞지만 적어두고 싶은 메모"},
}

FIELD_INTERVIEW_GUIDE = {
    "background": (
        "배경 항목은 '왜 이 경험을 시작했는지'에 초점을 맞춥니다.\n"
        "- 어떤 상황이나 계기가 있었는지 (팀 구성, 공고, 요청 등)\n"
        "- 참여 동기나 목적이 무엇이었는지\n"
        "- 감정보다는 상황/맥락 위주로 질문하세요.\n"
        "- 수치나 규모가 있다면 끌어내세요. (팀원 수, 기간 등)"
    ),
    "action": (
        "액션 항목은 '내가 직접 한 행동'에 초점을 맞춥니다.\n"
        "- 구체적으로 어떤 행동을 했는지 단계별로 끌어내세요.\n"
        "- 어떤 방법/도구/접근법을 사용했는지\n"
        "- 감정이나 느낌보다는 행동과 과정 위주로 질문하세요.\n"
        "- '어떻게 했나요?', '구체적으로 어떤 작업을 했나요?' 위주로 질문하세요."
    ),
    "result": (
        "결과 항목은 '이 경험에서 나온 객관적 성과'에 초점을 맞춥니다.\n"
        "- 수치나 지표가 있다면 반드시 끌어내세요. (%, 배수, 건수 등)\n"
        "- 수상, 진출, 완성 여부 등 객관적 결과를 물어보세요.\n"
        "- '어떤 결과가 나왔나요?', '수치로 표현할 수 있나요?' 위주로 질문하세요.\n"
        "- 감정 위주 질문은 피하세요."
    ),
    "learned": (
        "배운 점 항목은 '이 경험을 통해 향상된 역량이나 깨달음'에 초점을 맞춥니다.\n"
        "- 어떤 스킬이나 역량이 생겼는지\n"
        "- 어떤 새로운 관점이나 인사이트를 얻었는지\n"
        "'~을 알게 되었다', '~의 중요성을 깨달았다' 형식으로 끌어내세요.\n"
        "- 감정보다는 역량/인사이트 위주로 질문하세요."
    ),
    "reflection": (
        "느낀 점 항목은 '이 경험이 나에게 어떤 의미였는지'에 초점을 맞춥니다.\n"
        "- 이 항목에서만 감정, 성찰, 개인적 의미를 물어볼 수 있어요.\n"
        "- 힘들었던 점, 보람, 아쉬움, 성장감 등을 끌어내세요.\n"
        "- '그때 어떤 감정이었나요?', '이 경험이 어떤 의미였나요?' 위주로 질문하세요."
    ),
    "memo": (
        "기타 메모는 다른 항목에 넣기 애매하지만 기록해두고 싶은 내용입니다.\n"
        "- 추가로 남기고 싶은 것이 있는지 자유롭게 물어보세요."
    ),
}

SESSION_SYSTEM_PROMPT = """
당신은 사용자가 자신의 경험을 포트폴리오로 정리하도록 돕는 AI 인터뷰어입니다.

[절대 원칙]
1. 한 번에 하나의 항목만 다룹니다. 현재 항목 외의 것은 절대 묻지 마세요.
2. 사용자가 말하지 않은 내용을 지어내지 않습니다.
3. 친구처럼 편한 말투, 짧은 문장을 씁니다.
4. 사용자의 답변이 짧거나 모호하면 다른 각도로 다시 질문합니다.
5. 꼬리 질문으로 더 구체적인 이야기를 끌어내세요.
6. [항목별 인터뷰 가이드]를 반드시 참고해서 그 항목에 맞는 방향으로만 질문하세요.
   - 배경/액션/결과: 상황, 행동, 수치 위주 → 감정 질문 금지
   - 느낀 점: 감정, 성찰 위주 허용
7. suggestions는 항상 빈 배열 []로 두세요.

응답은 반드시 아래 JSON 형식으로만 하세요.
{
  "message": "사용자에게 보여줄 질문이나 짧은 반응 (1~2문장)",
  "suggestions": []
}
"""

SUMMARY_SYSTEM_PROMPT = """
당신은 사용자와 AI의 대화 내용과 기존에 작성된 내용을 합쳐서
포트폴리오용 문장으로 정리해주는 AI입니다.

[규칙]
1. 기존 작성 내용과 대화에서 나온 내용을 자연스럽게 합쳐서 정리하세요.
2. 사용자가 말하지 않은 내용을 지어내지 않습니다.
3. 문체는 "~했습니다", "~었습니다" 같은 정중한 문어체(합쇼체)로 작성합니다.
4. 3~5문장으로 간결하게 정리합니다.
5. 포트폴리오에 바로 쓸 수 있는 수준으로 다듬어주세요.
6. 수치나 구체적 사례가 있다면 반드시 포함하세요.

응답은 반드시 아래 JSON 형식으로만 하세요.
{
  "summary": "정리된 내용"
}
"""

KEYWORD_SYSTEM_PROMPT = """
다음은 사용자가 작성한 경험 기록입니다. 정체성, 가치관, 역량과 관련된 키워드를 추출하세요.

[규칙]
- 키워드는 명사 또는 짧은 구
- 최대 5개, 최소 2개
- 글에 드러난 내용에서 합리적으로 도출 가능한 것만 추출

응답은 반드시 아래 JSON 형식으로만 하세요.
{ "keywords": ["키워드1", "키워드2"] }
"""


def get_next_empty_field(fields: dict):
    for key in EXPERIENCE_FIELDS:
        if not (fields.get(key) or "").strip():
            return key
    return None


def build_field_status_context(fields: dict) -> str:
    lines = []
    for key, meta in EXPERIENCE_FIELDS.items():
        value = (fields.get(key) or "").strip()
        status = "작성됨" if value else "빈칸"
        lines.append(f"- {meta['label']} ({status}): {value if value else '(없음)'}")
    return "\n".join(lines)


def build_session_messages(fields: dict, history: list, target_field: str, user_message: str = None):
    field_status = build_field_status_context(fields)
    interview_guide = FIELD_INTERVIEW_GUIDE.get(target_field, "")

    if target_field:
        target_label = EXPERIENCE_FIELDS[target_field]["label"]
        target_guide = EXPERIENCE_FIELDS[target_field]["guide"]
        if user_message:
            instruction = (
                f"사용자가 '{target_label}' 항목에 대해 이렇게 답했습니다: \"{user_message}\"\n"
                f"[항목별 인터뷰 가이드]\n{interview_guide}\n\n"
                f"위 가이드에 맞게 꼬리 질문을 해주세요."
            )
        else:
            instruction = (
                f"지금 다룰 항목은 '{target_label}'입니다. ({target_guide})\n"
                f"[항목별 인터뷰 가이드]\n{interview_guide}\n\n"
                f"이 항목에 대해 자연스럽게 이야기를 시작할 수 있는 첫 질문을 해주세요."
            )
    else:
        target_field = get_next_empty_field(fields)
        if target_field:
            target_label = EXPERIENCE_FIELDS[target_field]["label"]
            target_guide = EXPERIENCE_FIELDS[target_field]["guide"]
            instruction = (
                f"다음으로 다룰 항목은 '{target_label}'입니다. ({target_guide})\n"
                f"자연스럽게 이 항목으로 넘어가는 첫 질문을 해주세요."
            )
        else:
            instruction = "모든 항목이 작성되었습니다. 수고했다고 격려해주세요."

    context = f"[현재 경험 항목 상태]\n{field_status}\n\n{instruction}"
    messages = list(history)
    messages.append({"role": "user", "content": context})
    return SESSION_SYSTEM_PROMPT, messages


def build_summary_messages(fields: dict, history: list, target_field: str):
    target_label = EXPERIENCE_FIELDS[target_field]["label"]
    target_guide = EXPERIENCE_FIELDS[target_field]["guide"]
    existing_content = (fields.get(target_field) or "").strip()

    conversation = "\n".join([
        f"{'AI' if h.get('role') == 'ai' else '사용자'}: {h.get('text', '')}"
        for h in history
        if h.get('role') in ('ai', 'user')
    ])

    content = (
        f"다음은 '{target_label}'({target_guide}) 항목에 대한 정보입니다.\n\n"
        f"[기존 작성 내용]\n{existing_content if existing_content else '(없음)'}\n\n"
        f"[대화 내용]\n{conversation}\n\n"
        f"위 기존 내용과 대화를 합쳐서 '{target_label}' 항목을 포트폴리오용 문장으로 정리해주세요.\n"
        f"문체는 '~했습니다' 합쇼체로, 3~5문장으로 작성해주세요."
    )

    return SUMMARY_SYSTEM_PROMPT, [{"role": "user", "content": content}]


def build_keyword_extraction_messages(fields: dict):
    full_text = "\n".join(
        f"{meta['label']}: {fields.get(key)}"
        for key, meta in EXPERIENCE_FIELDS.items()
        if fields.get(key)
    )
    messages = [{"role": "user", "content": f"[경험 기록]\n{full_text}"}]
    return KEYWORD_SYSTEM_PROMPT, messages