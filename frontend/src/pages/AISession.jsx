import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppHeader } from "../components/AppHeader";
import { authFetch } from "../auth";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5001";

const FIELD_KEYS = ["title", "role", "background", "action", "result", "learned", "reflection", "memo"];
const FIELD_LABELS = {
  title: "제목", role: "역할", background: "배경", action: "액션",
  result: "결과", learned: "배운 점", reflection: "느낀 점", memo: "기타 메모",
};

const AIBubble = ({ text, time, isSummary }) => (
  <div className="flex flex-col gap-2" style={{ maxWidth: 480 }}>
    <div style={{
      padding: "14px 16px", background: isSummary ? "#F0F4FF" : "white",
      boxShadow: "3px 3px 0px black", borderRadius: 4,
      outline: isSummary ? "1.5px solid #4A6CF7" : "1px solid black", outlineOffset: -1
    }}>
      {isSummary && <p style={{ color: "#4A6CF7", fontSize: 11, fontWeight: 700, marginBottom: 6 }}>✦ 정리 결과</p>}
      <p style={{ color: "black", fontSize: 14, fontWeight: 400, lineHeight: "22px", whiteSpace: "pre-wrap" }}>{text}</p>
    </div>
    {time && <p className="pl-1" style={{ color: "#5D5F5F", fontSize: 10 }}>{time}</p>}
  </div>
);

const UserBubble = ({ text, time }) => (
  <div className="flex flex-col items-end gap-1" style={{ maxWidth: 480, alignSelf: "flex-end" }}>
    <div style={{ padding: "12px 16px", background: "black", borderRadius: 4 }}>
      <p style={{ color: "white", fontSize: 14, fontWeight: 400, lineHeight: "22px", whiteSpace: "pre-wrap" }}>{text}</p>
    </div>
    {time && <p className="pr-1" style={{ color: "#5D5F5F", fontSize: 10 }}>{time}</p>}
  </div>
);

const formatTime = () => {
  const now = new Date();
  const h = now.getHours();
  const m = String(now.getMinutes()).padStart(2, "0");
  return `${h < 12 ? "오전" : "오후"} ${h > 12 ? h - 12 : h}:${m}`;
};
let _idCounter = 0;
const genId = () => `msg-${++_idCounter}-${Date.now()}`;

export const AISession = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const experience = location.state?.experience || {};

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(experience);
  const [targetField, setTargetField] = useState(null);
  const [editValues, setEditValues] = useState(experience);
  const bottomRef = useRef(null);
  const hasGreeted = useRef(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const getFirstEmptyField = (f) => FIELD_KEYS.find(k => !(f[k] || "").trim()) || null;

  const greet = async () => {
    const firstField = getFirstEmptyField(fields);
    const tf = firstField || FIELD_KEYS[0];
    setTargetField(tf);
    setLoading(true);
    try {
      const res = await authFetch(`${BACKEND_URL}/ai/session/start`, {
        method: "POST",
        body: JSON.stringify({ experience: fields, target_field: tf }),
      });
      const data = await res.json();
      setMessages([{ role: "ai", text: data.message, time: formatTime(), id: genId() }]);
    } catch {
      setMessages([{ role: "ai", text: "안녕하세요! 경험을 함께 채워볼게요.", time: formatTime(), id: genId() }]);
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
    const userMsg = { role: "user", text: text.trim(), time: formatTime(), id: genId() };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput("");
    setLoading(true);
    try {
      const res = await authFetch(`${BACKEND_URL}/ai/session/chat`, {
        method: "POST",
        body: JSON.stringify({ message: text.trim(), experience: fields, history: newHistory, target_field: targetField }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "ai", text: data.message, time: formatTime(), id: genId() }]);
    } catch {
      setMessages(prev => [...prev, { role: "ai", text: "잠시 오류가 생겼어요.", time: formatTime(), id: genId() }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSummarize = async () => {
    setLoading(true);
    try {
      const res = await authFetch(`${BACKEND_URL}/ai/session/summarize`, {
        method: "POST",
        body: JSON.stringify({ experience: fields, history: messages, target_field: targetField }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "ai", text: data.summary, time: formatTime(), id: genId(), isSummary: true }]);
    } catch {
      setMessages(prev => [...prev, { role: "ai", text: "정리 중 오류가 생겼어요.", time: formatTime(), id: genId() }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveField = () => {
    const updated = { ...fields, [targetField]: editValues[targetField] };
    setFields(updated);
    setMessages(prev => [...prev, {
      role: "ai", text: `'${FIELD_LABELS[targetField]}' 항목을 저장했어요! '다음 칸으로' 버튼을 눌러 계속해요.`,
      time: formatTime(), id: genId()
    }]);
  };

  const handleNextField = async () => {
    const currentIndex = FIELD_KEYS.indexOf(targetField);
    const nextField = FIELD_KEYS[currentIndex + 1] || null;
    if (!nextField) {
      setMessages(prev => [...prev, {
        role: "ai", text: "모든 항목을 다 채웠어요! 저장 버튼을 눌러 완성해요 🎉",
        time: formatTime(), id: genId()
      }]);
      return;
    }
    setTargetField(nextField);
    setLoading(true);
    try {
      const res = await authFetch(`${BACKEND_URL}/ai/session/chat`, {
        method: "POST",
        body: JSON.stringify({
          message: `이제 '${FIELD_LABELS[nextField]}' 항목에 대해 이야기해볼게요.`,
          experience: fields, history: messages, target_field: nextField
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "ai", text: data.message, time: formatTime(), id: genId() }]);
    } catch {
      setMessages(prev => [...prev, { role: "ai", text: "다음 항목으로 넘어갈게요!", time: formatTime(), id: genId() }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = async () => {
    try {
      const experienceId = fields.id;
      const url = experienceId
        ? `${BACKEND_URL}/experiences/${experienceId}/edit`
        : `${BACKEND_URL}/experiences/add`;
      const res = await authFetch(url, { method: "POST", body: JSON.stringify(fields) });
      const data = await res.json();
      if (res.ok) {
        const id = experienceId || data.experience.id;
        navigate(`/experiences/${id}`);
      }
    } catch (e) { console.error(e); }
  };

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden" style={{ background: "#FBF9F9" }}>
      <AppHeader />
      <div className="flex flex-1 overflow-hidden">

        {/* 좌측 패널 */}
        <aside className="flex flex-col overflow-y-auto flex-shrink-0"
          style={{ width: "32%", background: "#FBF9F9", borderRight: "1px solid black", padding: "24px 20px", gap: 12 }}>
          <h2 style={{ color: "black", fontSize: 18, fontWeight: 400 }}>경험 조각 기록하기</h2>
          {fields.title && (
            <p style={{ color: "black", fontSize: 15, fontWeight: 600, borderBottom: "1px solid #DBDAD9", paddingBottom: 12 }}>
              {fields.title}
            </p>
          )}

          <div className="flex flex-col" style={{ gap: 12 }}>
            {FIELD_KEYS.map((key) => {
              const isActive = key === targetField;
              return (
                <div key={key} className="flex flex-col" style={{
                  gap: 4, padding: 10,
                  outline: isActive ? "2px solid black" : "1px solid #DBDAD9",
                  outlineOffset: -1,
                  background: isActive ? "white" : "transparent",
                }}>
                  <p style={{
                    color: isActive ? "black" : "#5D5F5F", fontSize: 10,
                    fontWeight: 700, textTransform: "uppercase", letterSpacing: 1
                  }}>
                    {isActive ? `▶ ${FIELD_LABELS[key]}` : FIELD_LABELS[key]}
                  </p>
                  {isActive ? (
                    <textarea
                      value={editValues[key] || ""}
                      onChange={(e) => setEditValues(prev => ({ ...prev, [key]: e.target.value }))}
                      rows={4}
                      placeholder="여기에 직접 입력하거나 AI 정리 결과를 참고해서 작성해요"
                      className="w-full bg-transparent outline-none resize-none"
                      style={{ color: "black", fontSize: 12, lineHeight: "18px" }}
                    />
                  ) : (
                    <p style={{ color: fields[key] ? "#1B1C1C" : "#C6C6C7", fontSize: 12, lineHeight: "18px" }}>
                      {fields[key] || "아직 비어있어요"}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <button onClick={handleSaveAll} className="w-full hover:opacity-80 transition-opacity"
            style={{ padding: "10px 16px", background: "black", color: "white", fontSize: 13, marginTop: 8 }}>
            전체 저장하기
          </button>
        </aside>

        {/* 우측 채팅 패널 */}
        <div className="flex flex-col flex-1 overflow-hidden" style={{ background: "white" }}>
          <div className="flex items-center justify-between flex-shrink-0"
            style={{ padding: "16px 32px", background: "white", borderBottom: "1px solid black" }}>
            <div className="flex items-center gap-2">
              <div style={{ width: 28, height: 28, background: "black", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "white", fontSize: 12, fontWeight: 700 }}>AI</span>
              </div>
              <div className="flex flex-col">
                <p style={{ color: "black", fontSize: 13, fontWeight: 600 }}>ITER AI</p>
                <p style={{ color: "#5D5F5F", fontSize: 11 }}>
                  지금은 <b>{FIELD_LABELS[targetField]}</b> 항목을 이야기하고 있어요
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleSaveField} className="hover:opacity-80 transition-opacity"
                style={{ padding: "6px 14px", outline: "1px solid black", outlineOffset: -1, fontSize: 12, color: "black" }}>
                저장
              </button>
              <button onClick={handleNextField} className="hover:opacity-80 transition-opacity"
                style={{ padding: "6px 14px", background: "black", color: "white", fontSize: 12 }}>
                다음 칸으로 →
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col" style={{ padding: "24px 32px", gap: 16 }}>
            {messages.map((msg) =>
              msg.role === "ai" ? (
                <AIBubble key={msg.id} text={msg.text} time={msg.time} isSummary={msg.isSummary} />
              ) : (
                <UserBubble key={msg.id} text={msg.text} time={msg.time} />
              )
            )}
            {loading && (
              <div className="flex gap-1 items-center">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="rounded-full"
                    style={{ width: 5, height: 5, background: "#C6C6C7", animation: `bounce 1.2s ${i * 0.2}s infinite` }} />
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="flex-shrink-0 flex flex-col"
            style={{ padding: "16px 32px", background: "white", borderTop: "1px solid black", gap: 10 }}>
            <div className="flex items-end gap-3">
              <div className="flex-1" style={{ borderBottom: "2px solid black", paddingBottom: 10, paddingTop: 10 }}>
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) sendMessage(input); }}
                  placeholder={`${FIELD_LABELS[targetField] || ""}에 대해 자유롭게 이야기해주세요...`}
                  className="w-full bg-transparent outline-none"
                  style={{ color: "#1B1C1C", fontSize: 14 }} />
              </div>
              <button onClick={() => sendMessage(input)} disabled={loading || !input.trim()}
                className="hover:opacity-80 transition-opacity disabled:opacity-40"
                style={{ padding: "8px 20px", background: "black", color: "white", fontSize: 13 }}>
                보내기
              </button>
            </div>
            <button onClick={handleSummarize} disabled={loading}
              className="hover:opacity-70 transition-opacity disabled:opacity-40"
              style={{ alignSelf: "flex-start", padding: "4px 12px", borderRadius: 12, outline: "1px solid black", outlineOffset: -1, color: "black", fontSize: 11 }}>
              ✦ 지금까지 내용 정리하기
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes bounce { 0%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-5px); } }`}</style>
    </div>
  );
};