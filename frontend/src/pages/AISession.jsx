import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppHeader } from "../components/AppHeader";
import { authFetch } from "../auth";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5001";

const QUICK_REPLIES = ["상황 설명 더 하기", "다음 단계로 넘어가기", "팁을 알려주세요"];

const FIELD_LABELS = {
  role: "역할",
  background: "배경",
  action: "액션",
  result: "결과",
  learned: "배운 점",
  reflection: "느낀 점",
  memo: "기타 메모",
};

// 채팅 말풍선 — AI
const AIBubble = ({ text, time, suggestions, targetField, onAccept }) => (
  <div className="flex flex-col gap-2" style={{ maxWidth: 576 }}>
    <div style={{ padding: "22px 24px 24px", background: "white", boxShadow: "4px 4px 0px black", borderRadius: 4, outline: "1px solid black", outlineOffset: -1 }}>
      <p style={{ color: "black", fontSize: 18, fontWeight: 400, lineHeight: "28.8px", whiteSpace: "pre-wrap" }}>
        {text}
      </p>
    </div>

    {suggestions && suggestions.length > 0 && (
      <div className="flex flex-col gap-2" style={{ paddingLeft: 4 }}>
        <span style={{ color: "#5D5F5F", fontSize: 12 }}>이렇게 써보는 건 어때요~? (클릭하면 칸에 들어가요)</span>
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => onAccept(targetField, s)}
            className="text-left hover:opacity-70 transition-opacity"
            style={{ background: "#F3F2F1", border: "1px solid #C6C6C7", padding: "10px 14px", borderRadius: 4, fontSize: 15, color: "#1B1C1C" }}
          >
            {s}
          </button>
        ))}
      </div>
    )}

    {time && <p className="pl-1" style={{ color: "#5D5F5F", fontSize: 10 }}>{time}</p>}
  </div>
);

// 채팅 말풍선 — 사용자
const UserBubble = ({ text, time }) => (
  <div className="flex flex-col items-end gap-2" style={{ maxWidth: 576, alignSelf: "flex-end" }}>
    <div style={{ padding: "24px 33px 24px 24px", background: "black", borderRadius: 4 }}>
      <p style={{ color: "white", fontSize: 18, fontWeight: 400, lineHeight: "28.8px", whiteSpace: "pre-wrap" }}>
        {text}
      </p>
    </div>
    {time && (
      <p className="pr-1" style={{ color: "#5D5F5F", fontSize: 10, fontFamily: "'Inter', sans-serif", fontWeight: 400, lineHeight: "15px" }}>
        {time}
      </p>
    )}
  </div>
);

const formatTime = () => {
  const now = new Date();
  const h = now.getHours();
  const m = String(now.getMinutes()).padStart(2, "0");
  return `${h < 12 ? "오전" : "오후"} ${h > 12 ? h - 12 : h}:${m}`;
};

export const AISession = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const experience = location.state?.experience || {};

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(experience);
  const [targetField, setTargetField] = useState(null);
  const bottomRef = useRef(null);
  const hasGreeted = useRef(false);

  // 페이지 진입 시 AI 첫 인사
  const greet = async () => {
  setLoading(true);
  try {
    const res = await authFetch(`${BACKEND_URL}/ai/session/start`, {
      method: "POST",
      body: JSON.stringify({ experience: fields }),
    });
    const data = await res.json();
      if (!res.ok || !data.message) {
        console.error("chat 응답 이상함:", data);
        setMessages((prev) => [...prev, { role: "ai", text: "응답을 받지 못했어요. 다시 시도해주세요.", time: formatTime() }]);
        return;
      }
      setMessages((prev) => [...prev, {
        role: "ai", text: data.message, time: formatTime(),
        suggestions: data.suggestions || [], targetField: data.target_field,
      }]);
      setTargetField(data.target_field);
        } catch (err) {
          console.error(err);
    setMessages([{ role: "ai", text: "안녕하세요! 작성하신 경험을 함께 살펴볼게요.", time: formatTime() }]);
  } finally {
    setLoading(false);
  }
};
   useEffect(() => {
  if (hasGreeted.current) return;
  hasGreeted.current = true;
  greet();
}, []);


  const sendMessage = async (text) => {
      if (!text.trim()) return;
      const userMsg = { role: "user", text: text.trim(), time: formatTime() };
      const newHistory = [...messages, userMsg];
      setMessages(newHistory);
      setInput("");
      setLoading(true);

      try {
        const res = await authFetch(`${BACKEND_URL}/ai/session/chat`, {
          method: "POST",
          body: JSON.stringify({
            message: text.trim(),
            experience: fields,
            history: newHistory,
            target_field: targetField,
          }),
        });
        const data = await res.json();
        setMessages((prev) => [...prev, {
          role: "ai", text: data.message, time: formatTime(),
          suggestions: data.suggestions || [], targetField: data.target_field,
        }]);
        setTargetField(data.target_field);
      } catch {
        setMessages((prev) => [...prev, { role: "ai", text: "잠시 오류가 생겼어요. 다시 시도해 주세요.", time: formatTime() }]);
      } finally {
        setLoading(false);
      }
};

  const handleSave = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/experiences/add`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      if (res.ok) navigate("/experiences");
    } catch (e) {
      console.error(e);
    }
  };

  const handleAcceptSuggestion = (field, text) => {
    if (!field) return;
    setFields((prev) => ({ ...prev, [field]: text }));
  };

  return (
    <div
        className="w-full h-screen flex flex-col overflow-hidden"
        style={{ background: "linear-gradient(0deg, #FBF9F9 0%, #FBF9F9 100%), white" }}
        >
        <AppHeader />

  <div className="flex flex-1 overflow-hidden">
        {/* ── 좌측 패널: 경험 요약 ── */}
        <aside
          className="flex flex-col overflow-y-auto flex-shrink-0"
          style={{
            width: "33.33%",
            background: "#FBF9F9",
            borderRight: "1px solid black",
            padding: "40px 32px",
            gap: 31,
          }}
        >
          <h2 style={{ color: "black", fontSize: 32, fontWeight: 400, lineHeight: "41.6px" }}>
            경험 조각 기록하기
          </h2>

          <div className="flex flex-col" style={{ gap: 31 }}>
            {Object.entries(FIELD_LABELS).map(([key, label]) => {
              const value = fields[key];
              const isEmpty = !value;
              return (
                <div key={key} className="flex flex-col" style={{ gap: 8 }}>
                  <p
                    style={{
                      color: "#5D5F5F",
                      fontSize: 14,
                      fontWeight: 400,
                      textTransform: "uppercase",
                      lineHeight: "16.8px",
                      letterSpacing: 1.40,
                    }}
                  >
                    {label}
                  </p>
                  {key === "role" ? (
                    <div style={{ paddingTop: 8, paddingBottom: 8, borderBottom: "1px solid black" }}>
                      <p style={{ color: isEmpty ? "#5D5F5F" : "black", fontSize: 24, fontWeight: 400, lineHeight: "32px" }}>
                        {value || "역할을 입력해주세요"}
                      </p>
                    </div>
                  ) : (
                    <div
                      className="relative"
                      style={{
                        padding: 16,
                        outline: "1px solid black",
                        outlineOffset: -1,
                        minHeight: 80,
                        opacity: isEmpty ? 0.6 : 1,
                      }}
                    >
                      <p
                        style={{
                          color: isEmpty ? "#5D5F5F" : "black",
                          fontSize: 16,
                          fontWeight: 400,
                          lineHeight: "24px",
                        }}
                      >
                        {value || "아직 비어있어요. 오른쪽 ITER AI에게 말을 걸어보세요."}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}

            <button
              onClick={handleSave}
              className="w-full flex items-center justify-center hover:opacity-80 transition-opacity"
              style={{
                padding: "16px 24px",
                outline: "1px solid black",
                outlineOffset: -1,
                color: "black",
                fontSize: 16,
                fontWeight: 400,
                lineHeight: "16px",
              }}
            >
              기록을 저장할까요?
            </button>
          </div>
        </aside>

        {/* ── 우측 패널: AI 채팅 ── */}
        <div className="flex flex-col flex-1 overflow-hidden" style={{ background: "white" }}>
          {/* 채팅 헤더 */}
          <div
            className="flex items-center justify-between flex-shrink-0"
            style={{ padding: "24px 64px", background: "white", borderBottom: "1px solid black" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{ width: 32, height: 32, background: "black", borderRadius: 2 }}
              >
                <span style={{ color: "white", fontSize: 14, fontWeight: 700 }}>AI</span>
              </div>
              <div className="flex flex-col">
                <p style={{ color: "black", fontSize: 14, fontFamily: "'Inter', sans-serif", fontWeight: 600, lineHeight: "16.8px", letterSpacing: 0.70 }}>
                  ITER AI
                </p>
                <p style={{ color: "#5D5F5F", fontSize: 12, fontWeight: 400, lineHeight: "16px" }}>
                  같이 회고해 볼까요?
                </p>
              </div>
            </div>
            <span
              className="px-3 py-1"
              style={{
                background: "#E9E8E7",
                borderRadius: 12,
                color: "black",
                fontSize: 10,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                textTransform: "uppercase",
                lineHeight: "15px",
                letterSpacing: 0.50,
              }}
            >
              INTERVIEW MODE
            </span>
          </div>

          {/* 채팅 메시지 영역 */}
          <div className="flex-1 overflow-y-auto flex flex-col" style={{ padding: "40px 64px", gap: 24 }}>
            {messages.map((msg, i) =>
                    msg.role === "ai" ? (
                      <AIBubble
                        key={i}
                        text={msg.text}
                        time={msg.time}
                        suggestions={msg.suggestions}
                        targetField={msg.targetField}
                        onAccept={handleAcceptSuggestion}
                      />
                    ) : (
                      <UserBubble key={i} text={msg.text} time={msg.time} />
                    )
      )}
            {loading && (
              <div className="flex gap-1 items-center" style={{ paddingLeft: 4 }}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="rounded-full"
                    style={{
                      width: 6, height: 6, background: "#C6C6C7",
                      animation: `bounce 1.2s ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* 입력 영역 */}
          <div
            className="flex-shrink-0 flex flex-col"
            style={{ padding: "32px 64px", background: "white", borderTop: "1px solid black", gap: 16 }}
          >
            <div className="flex items-end gap-4" style={{ maxWidth: 896 }}>
              <div className="flex-1" style={{ borderBottom: "2px solid black", paddingBottom: 16, paddingTop: 16 }}>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                          sendMessage(input);
                        }
                      }}
                  placeholder="ITER에게 답변을 남겨주세요..."
                  className="w-full bg-transparent outline-none"
                  style={{
                    color: "#1B1C1C",
                    fontSize: 16,
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400,
                    lineHeight: "24px",
                  }}
                />
              </div>
              <button
                onClick={() => sendMessage(input)}
                disabled={loading || !input.trim()}
                className="flex-shrink-0 hover:opacity-80 transition-opacity disabled:opacity-40"
                style={{
                  padding: "8px 32px",
                  background: "black",
                  color: "white",
                  fontSize: 16,
                  fontWeight: 400,
                  lineHeight: "16px",
                }}
              >
                보내기
              </button>
            </div>

            {/* 빠른 답변 칩 */}
            <div className="flex gap-2 flex-wrap" style={{ maxWidth: 896 }}>
              {QUICK_REPLIES.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  disabled={loading}
                  className="hover:opacity-70 transition-opacity disabled:opacity-40"
                  style={{
                    padding: "4px 12px",
                    borderRadius: 12,
                    outline: "1px solid #5D5F5F",
                    outlineOffset: -1,
                    color: "#5D5F5F",
                    fontSize: 12,
                    fontWeight: 400,
                    lineHeight: "16px",
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
};
