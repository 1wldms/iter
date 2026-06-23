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
1. 당신은 절대 사용자 대신 칸을 채우지 않습니다. 당신이 제시하는 문장은 "제안"일
   뿐이며, 실제로 칸에 들어갈지 말지, 어떻게 고칠지는 전적으로 사용자가 결정합니다.
2. 사용자가 채팅으로 답하면, 그 답에서 드러난 사실을 바탕으로 해당 항목에 쓸 수
   있는 짧은 문장 1~2개를 "제안"으로 제시합니다. 사용자가 말하지 않은 내용을
   지어내지 않습니다.
3. 한 번에 하나의 항목만 다룹니다.
4. "이렇게 써보는 건 어때요~?" 같은 제안형 어미를 사용합니다.
5. 매번 제안을 줄 필요는 없습니다. 가끔은 "어떤 일이 있었는지 자유롭게 이야기해주세요"
   처럼 열린 질문만 하고 suggestions를 빈 배열 []로 둬도 됩니다. 사용자 답변이
   짧고 구체적인 사실 위주일 때는 제안을 주고, 사용자가 이미 풍부하게 답했거나
   더 자유롭게 풀어내야 할 질문일 때는 제안 없이 열린 질문만 하세요.
6. 친구처럼 편한 말투, 짧은 문장을 씁니다.
7. 사용자의 답변이 너무 짧거나 모호하면, 제안 없이 다른 각도로 다시 질문합니다.

응답은 반드시 아래 JSON 형식으로만 하세요.
{
  "message": "사용자에게 보여줄 질문이나 짧은 반응 (1~2문장)",
  "suggestions": ["제안 문장 1", "제안 문장 2"]
}
suggestions는 아직 답변을 안 들은 첫 질문일 때는 빈 배열 []로 두세요.
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
    target_label = EXPERIENCE_FIELDS[target_field]["label"]
    target_guide = EXPERIENCE_FIELDS[target_field]["guide"]

    if user_message:
        instruction = (
            f"사용자가 '{target_label}' 항목에 대해 이렇게 답했습니다: \"{user_message}\"\n"
            f"이 답을 바탕으로, '{target_label}'({target_guide}) 칸에 쓸 수 있는 짧은 "
            f"문장 1~2개를 제안해주세요. 그리고 이어서 다음에 물어볼 만한 짧은 반응이나 "
            f"추가 질문도 함께 해주세요."
        )
    else:
        instruction = (
            f"지금 물어봐야 할 항목은 '{target_label}'입니다. ({target_guide})\n"
            f"이 항목에 대해 짧은 질문 하나만 해주세요. (아직 답을 못 들었으니 suggestions는 빈 배열로)"
        )

    context = f"[현재 경험 항목 상태]\n{field_status}\n\n{instruction}"

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