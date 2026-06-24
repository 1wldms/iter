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

SESSION_SYSTEM_PROMPT = """
당신은 사용자가 자신의 경험을 깊고 풍부하게 표현하도록 돕는 AI 인터뷰어입니다.

[절대 원칙]
1. 한 번에 하나의 항목만 다룹니다. 현재 다루는 항목 외의 것은 절대 묻지 마세요.
2. 사용자가 말하지 않은 내용을 지어내지 않습니다.
3. 친구처럼 편한 말투, 짧은 문장을 씁니다.
4. 사용자의 답변이 짧거나 모호하면 다른 각도로 다시 질문합니다.
5. 꼬리 질문을 통해 사용자가 더 구체적으로 이야기할 수 있도록 유도합니다.
   예: "그때 어떤 기분이었어요?", "구체적으로 어떻게 했는지 더 말해줄 수 있어요?"
6. suggestions는 항상 빈 배열 []로 두세요. 제안 문장은 더 이상 사용하지 않습니다.

응답은 반드시 아래 JSON 형식으로만 하세요.
{
  "message": "사용자에게 보여줄 질문이나 짧은 반응 (1~2문장)",
  "suggestions": []
}
"""

SUMMARY_SYSTEM_PROMPT = """
당신은 사용자와 AI의 대화 내용을 보고, 특정 항목에 대해 사용자가 말한 내용을 
포트폴리오용 문장으로 정리해주는 AI입니다.

[규칙]
1. 사용자가 말한 내용만 사용합니다. 없는 내용을 지어내지 않습니다.
2. 문체는 "~했습니다", "~었습니다" 같은 정중한 문어체(합쇼체)로 작성합니다.
3. 3~5문장으로 간결하게 정리합니다.
4. 포트폴리오에 바로 쓸 수 있는 수준으로 다듬어주세요.

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

    if target_field:
        target_label = EXPERIENCE_FIELDS[target_field]["label"]
        target_guide = EXPERIENCE_FIELDS[target_field]["guide"]
        if user_message:
            instruction = (
                f"사용자가 '{target_label}' 항목에 대해 이렇게 답했습니다: \"{user_message}\"\n"
                f"이 답변을 바탕으로 '{target_label}'({target_guide})에 대해 더 깊이 파고드는 "
                f"꼬리 질문을 해주세요. 구체적인 사례, 수치, 감정 등을 끌어내세요."
            )
        else:
            instruction = (
                f"지금 다룰 항목은 '{target_label}'입니다. ({target_guide})\n"
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

    conversation = "\n".join([
        f"{'AI' if h.get('role') == 'ai' else '사용자'}: {h.get('text', '')}"
        for h in history
    ])

    content = (
        f"다음은 '{target_label}'({target_guide})에 대한 대화 내용입니다.\n\n"
        f"{conversation}\n\n"
        f"위 대화에서 사용자가 말한 내용을 바탕으로 '{target_label}' 항목을 포트폴리오용 문장으로 정리해주세요."
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

