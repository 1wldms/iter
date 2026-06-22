EXPERIENCE_FIELDS = {
    "role":       {"label": "역할",  "guide": "프로젝트에서 나의 포지션"},
    "background": {"label": "배경",  "guide": "어떤 계기나 이유로 시작했는지"},
    "action":     {"label": "액션",  "guide": "진행을 위해 직접 한 행동들"},
    "result":     {"label": "결과",  "guide": "이 경험에서 나온 결과"},
    "learned":    {"label": "배운점", "guide": "성격이든 스킬이든 향상된 부분"},
    "reflection": {"label": "느낀점", "guide": "기억된 방식, 그때의 감정"},
    "memo":       {"label": "기타",  "guide": "카테고리에 안 맞지만 적어두고 싶은 메모"},
}

SESSION_SYSTEM_PROMPT = """
당신은 사용자가 자신의 경험을 7가지 항목으로 정리하도록 돕는 AI입니다.

[절대 원칙]
1. 당신은 절대 문장을 대신 완성해주지 않습니다. 당신의 역할은 "질문"뿐입니다.
2. 지금 물어봐야 할 항목 하나에 대해서만, 짧고 구체적인 질문 1개를 합니다.
3. 이미 채워진 다른 항목 내용을 참고해서, 자연스럽게 이어지는 질문을 만듭니다.
4. "이런 부분도 떠올려보면 어때요~?" 같은 부드러운 힌트는 줄 수 있지만,
   완성된 문장을 사용자 대신 만들어주지는 않습니다.
5. 친구처럼 편한 말투, 짧은 문장을 씁니다.

응답은 반드시 아래 JSON 형식으로만 하세요.
{ "message": "사용자에게 보여줄 질문 1~2문장" }
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
    """비어있는 첫 번째 항목 key를 찾아줌. 다 채워졌으면 None."""
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


def build_session_messages(fields: dict, history: list, target_field: str):
    field_status = build_field_status_context(fields)
    target_label = EXPERIENCE_FIELDS[target_field]["label"]
    target_guide = EXPERIENCE_FIELDS[target_field]["guide"]

    context = (
        f"[현재 경험 항목 상태]\n{field_status}\n\n"
        f"지금 물어봐야 할 항목은 '{target_label}'입니다. ({target_guide})\n"
        f"이 항목에 대해 짧은 질문 하나만 해주세요."
    )

    messages = list(history)
    messages.append({"role": "user", "content": context})
    return SESSION_SYSTEM_PROMPT, messages


def build_keyword_extraction_messages(fields: dict):
    full_text = "\n".join(
        f"{meta['label']}: {fields.get(key)}"
        for key, meta in EXPERIENCE_FIELDS.items()
        if fields.get(key)
    )
    messages = [{"role": "user", "content": f"[경험 기록]\n{full_text}"}]
    return KEYWORD_SYSTEM_PROMPT, messages