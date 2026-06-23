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

const AIBubble = ({ id, text, time, suggestions, targetField, used, selected, onToggle, onSubmit }) => (
  <div className="flex flex-col gap-2" style={{ maxWidth: 480 }}>
    <div style={{ padding: "14px 16px", background: "white", boxShadow: "3px 3px 0px black", borderRadius: 4, outline: "1px solid black", outlineOffset: -1 }}>
      <p style={{ color: "black", fontSize: 14, fontWeight: 400, lineHeight: "22px", whiteSpace: "pre-wrap" }}>
        {text}
      </p>
    </div>
    {suggestions && suggestions.length > 0 && (
      <div className="flex flex-col gap-2" style={{ paddingLeft: 4 }}>
        <span style={{ color: "#5D5F5F", fontSize: 11 }}>
          {used ? "선택 완료했어요" : "이렇게 써보는 건 어때요~?"}
        </span>
        {suggestions.map((s, i) => {
          const isSelected = selected.includes(i);
          return (
            <button key={i} onClick={() => !used && onToggle(id, i)} disabled={used}
              className="text-left transition-opacity"
              style={{ background: isSelected ? "black" : "#F3F2F1", color: isSelected ? "white" : "#1B1C1C", border: "1px solid #C6C6C7", padding: "8px 12px", borderRadius: 4, fontSize: 13, opacity: used && !isSelected ? 0.4 : 1, cursor: used ? "default" : "pointer" }}>
              {s}
            </button>
          );
        })}
        {!used && (
          <button onClick={() => onSubmit(id, targetField, selected.map((i) => suggestions[i]))}
            disabled={selected.length === 0}
            className="hover:opacity-80 transition-opacity disabled:opacity-40"
            style={{ alignSelf: "flex-start", marginTop: 2, background: "black", color: "white", padding: "6px 14px", borderRadius: 4, fontSize: 12 }}>
            선택한 내용 보내기
          </button>
        )}
      </div>
    )}
    {time && <p className="pl-1" style={{ color: "#5D5F5F", fontSize: 10 }}>{time}</p>}
  </div>
);

const UserBubble = ({ text, time, fromSuggestion }) => (
  <div className="flex flex-col items-end gap-1" style={{ maxWidth: 480, alignSelf: "flex-end" }}>
    {fromSuggestion && <span style={{ color: "#5D5F5F", fontSize: 10 }}>제안에서 선택한 답변</span>}
    <div style={{ padding: "12px 16px", background: fromSuggestion ? "#3A3A3A" : "black", borderRadius: 4 }}>
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
const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

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
  const [isComplete, setIsComplete] = useState(false);
  const [selectedSuggestions, setSelectedSuggestions] = useState({});
  const [usedSuggestionMsgs, setUsedSuggestionMsgs] = useState({});

  const greet = async () => {
    setLoading(true);
    try {
      const res = await authFetch(`${BACKEND_URL}/ai/session/start`, {
        method: "POST",
        body: JSON.stringify({ experience: fields }),
      });
      const data = await res.json();
      if (!res.ok || !data.message) {
        setMessages([{ role: "ai", text: "AI 응답을 받지 못했어요.", time: formatTime(), id: genId() }]);
        return;
      }
      setMessages([{ role: "ai", text: data.message, time: formatTime(), suggestions: data.suggestions || [], targetField: data.target_field, id: genId() }]);
      setTargetField(data.target_field);
      setIsComplete(data.is_complete);
    } catch (err) {
      setMessages([{ role: "ai", text: "안녕하세요! 작성하신 경험을 함께 살펴볼게요.", time: formatTime(), id: genId() }]);
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
      if (!res.ok || !data.message) {
        setMessages((prev) => [...prev, { role: "ai", text: "응답을 받지 못했어요.", time: formatTime(), id: genId() }]);
        return;
      }
      setMessages((prev) => [...prev, { role: "ai", text: data.message, time: formatTime(), suggestions: data.suggestions || [], targetField: data.target_field, id: genId() }]);
      setTargetField(data.target_field);
      setIsComplete(data.is_complete);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "ai", text: "잠시 오류가 생겼어요.", time: formatTime(), id: genId() }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const experienceId = fields.id;
      const url = experienceId
        ? `${BACKEND_URL}/experiences/${experienceId}/edit`
        : `${BACKEND_URL}/experiences/add`;
      const method = "POST";

      const res = await authFetch(url, {
        method,
        body: JSON.stringify(fields),
      });
      const data = await res.json();
      if (res.ok) {
        const id = experienceId || data.experience.id;
        navigate(`/experiences/${id}`);
      }
    } catch (e) { console.error(e); }
  };

  const toggleSuggestion = (msgId, index) => {
    setSelectedSuggestions((prev) => {
      const current = prev[msgId] || [];
      const next = current.includes(index) ? current.filter((i) => i !== index) : [...current, index];
      return { ...prev, [msgId]: next };
    });
  };

  const submitSuggestions = (msgId, field, texts) => {
    if (!field || texts.length === 0) return;
    setUsedSuggestionMsgs((prev) => ({ ...prev, [msgId]: true }));
    const combined = texts.join("\n");
    const existing = fields[field] || "";
    const merged = existing ? `${existing}\n${combined}` : combined;
    const updatedFields = { ...fields, [field]: merged };
    setFields(updatedFields);
    const userMsg = { role: "user", text: combined, time: formatTime(), id: genId(), fromSuggestion: true };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    advanceToNextQuestion(updatedFields, newHistory);
  };

  const advanceToNextQuestion = async (updatedFields, historyOverride) => {
    setLoading(true);
    try {
      const res = await authFetch(`${BACKEND_URL}/ai/session/chat`, {
        method: "POST",
        body: JSON.stringify({ message: "이 내용을 칸에 추가했어요. 다음 질문 부탁해요.", experience: updatedFields, history: historyOverride || messages, target_field: null }),
      });
      const data = await res.json();
      if (!res.ok || !data.message) {
        console.error("advance 응답 이상함:", data);
        return;
      }
      setMessages((prev) => [...prev, {
        role: "ai", text: data.message, time: formatTime(),
        suggestions: data.suggestions || [], targetField: data.target_field,
      }]);
      setTargetField(data.target_field);
      setIsComplete(data.is_complete);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const askAboutField = async (fieldKey) => {
  setLoading(true);
  try {
    const res = await authFetch(`${BACKEND_URL}/ai/session/chat`, {
      method: "POST",
      body: JSON.stringify({
        message: "이 항목에 대해 조금 더 자세히 이야기해보고 싶어요. 추가로 물어봐주세요.",
        experience: fields,
        history: messages,
        target_field: fieldKey,
      }),
    });
    const data = await res.json();
    if (!res.ok || !data.message) {
      console.error("askAboutField 응답 이상함:", data);
      return;
    }
    setMessages((prev) => [...prev, {
      role: "ai", text: data.message, time: formatTime(),
      suggestions: data.suggestions || [], targetField: data.target_field || fieldKey,
    }]);
    setTargetField(data.target_field || fieldKey);
    setIsComplete(false);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden" style={{ background: "#FBF9F9" }}>
      <AppHeader />
      <div className="flex flex-1 overflow-hidden">

        {/* 좌측 패널 */}
        <aside className="flex flex-col overflow-y-auto flex-shrink-0"
          style={{ width: "32%", background: "#FBF9F9", borderRight: "1px solid black", padding: "24px 20px", gap: 16 }}>
          <h2 style={{ color: "black", fontSize: 20, fontWeight: 400, lineHeight: "28px" }}>경험 조각 기록하기</h2>
          <div className="flex flex-col" style={{ gap: 16 }}>
            {Object.entries(FIELD_LABELS).map(([key, label]) => {
              const value = fields[key];
              const isEmpty = !value;
              return (
                <div key={key} className="flex flex-col" style={{ gap: 4 }}>
                  <p style={{ color: "#5D5F5F", fontSize: 11, fontWeight: 400, textTransform: "uppercase", letterSpacing: 1 }}>{label}</p>
                  {key === "role" ? (
                    <div style={{ paddingBottom: 6, borderBottom: "1px solid black" }}>
                      <p style={{ color: isEmpty ? "#5D5F5F" : "black", fontSize: 16, fontWeight: 400 }}>{value || "역할을 입력해주세요"}</p>
                    </div>
                  ) : (
                    <div style={{ padding: 10, outline: "1px solid black", outlineOffset: -1, minHeight: 48, opacity: isEmpty ? 0.6 : 1 }}>
                      <p style={{ color: isEmpty ? "#5D5F5F" : "black", fontSize: 12, fontWeight: 400, lineHeight: "18px" }}>
                        {value || "아직 비어있어요."}
                      </p>
                      <button onClick={() => askAboutField(key)} className="hover:opacity-70 transition-opacity"
                        style={{ marginTop: 4, color: "#5D5F5F", fontSize: 11, textDecoration: "underline", background: "none", border: "none", cursor: "pointer" }}>
                        AI에게 더 물어보기
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
            <button onClick={handleSave} className="w-full hover:opacity-80 transition-opacity"
              style={{ padding: "10px 16px", outline: "1px solid black", outlineOffset: -1, color: "black", fontSize: 13, fontWeight: 400 }}>
              기록을 저장할까요?
            </button>
          </div>
        </aside>

        {/* 우측 채팅 패널 */}
        <div className="flex flex-col flex-1 overflow-hidden" style={{ background: "white" }}>
          <div className="flex items-center justify-between flex-shrink-0"
            style={{ padding: "16px 32px", background: "white", borderBottom: "1px solid black" }}>
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center flex-shrink-0"
                style={{ width: 28, height: 28, background: "black", borderRadius: 2 }}>
                <span style={{ color: "white", fontSize: 12, fontWeight: 700 }}>AI</span>
              </div>
              <div className="flex flex-col">
                <p style={{ color: "black", fontSize: 13, fontWeight: 600 }}>ITER AI</p>
                <p style={{ color: "#5D5F5F", fontSize: 11 }}>같이 회고해 볼까요?</p>
              </div>
            </div>
            <span className="px-2 py-1"
              style={{ background: "#E9E8E7", borderRadius: 12, color: "black", fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>
              INTERVIEW MODE
            </span>
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col" style={{ padding: "24px 32px", gap: 16 }}>
            {messages.map((msg) =>
              msg.role === "ai" ? (
                <AIBubble key={msg.id} id={msg.id} text={msg.text} time={msg.time}
                  suggestions={msg.suggestions} targetField={msg.targetField}
                  used={!!usedSuggestionMsgs[msg.id]} selected={selectedSuggestions[msg.id] || []}
                  onToggle={toggleSuggestion} onSubmit={submitSuggestions} />
              ) : (
                <UserBubble key={msg.id} text={msg.text} time={msg.time} fromSuggestion={msg.fromSuggestion} />
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
                  placeholder="ITER에게 답변을 남겨주세요..."
                  className="w-full bg-transparent outline-none"
                  style={{ color: "#1B1C1C", fontSize: 14, fontWeight: 400, lineHeight: "22px" }} />
              </div>
              <button onClick={() => sendMessage(input)} disabled={loading || !input.trim()}
                className="flex-shrink-0 hover:opacity-80 transition-opacity disabled:opacity-40"
                style={{ padding: "8px 20px", background: "black", color: "white", fontSize: 13, fontWeight: 400 }}>
                보내기
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {QUICK_REPLIES.map((q) => (
                <button key={q} onClick={() => sendMessage(q)} disabled={loading}
                  className="hover:opacity-70 transition-opacity disabled:opacity-40"
                  style={{ padding: "3px 10px", borderRadius: 12, outline: "1px solid #5D5F5F", outlineOffset: -1, color: "#5D5F5F", fontSize: 11 }}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes bounce { 0%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-5px); } }`}</style>
    </div>
  );
};