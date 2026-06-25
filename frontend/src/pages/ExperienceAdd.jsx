import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../auth";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5001";

const fields = [
  { key: "title", label: "제목", placeholder: "경험 이름 ex) [교내 공모전] 프론트엔드 개발", rows: 1, borderColor: "#6B7280" },
  { key: "role", label: "역할", placeholder: "프로젝트에서 내가 맡은 포지션이 뭐였나요?", rows: 1, borderColor: "#6B7280" },
  { key: "background", label: "배경", placeholder: "이 활동을 시작하게 된 계기나 당시 상황을 설명해 주세요.", rows: 3, borderColor: "#C6C6C7" },
  { key: "action", label: "액션", placeholder: "목표를 달성하기 위해 구체적으로 어떤 행동을 했나요?", rows: 3, borderColor: "#C6C6C7" },
  { key: "result", label: "결과", placeholder: "어떤 성과를 얻었나요? 정량적인 수치가 있다면 더욱 좋아요.", rows: 3, borderColor: "#C6C6C7" },
  { key: "learned", label: "배운 점", placeholder: "이 과정을 통해 새롭게 알게 되거나 깨달은 점은 무엇인가요?", rows: 3, borderColor: "#C6C6C7" },
  { key: "reflection", label: "느낀 점", placeholder: "힘들었던 점, 뿌듯했던 점 등 솔직한 감정을 적어주세요.", rows: 3, borderColor: "#C6C6C7" },
  { key: "memo", label: "기타 메모", placeholder: "추가로 남기고 싶은 기록이 있다면 자유롭게 작성해 주세요.", rows: 2, borderColor: "#C6C6C7" },
];

export const ExperienceAdd = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "", role: "", background: "", action: "", result: "",
    learned: "", reflection: "", memo: "", start_date: "", end_date: "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await authFetch(`${BACKEND_URL}/experiences/add`, {
        method: "POST",
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        navigate("/ai-session", { state: { experience: data.experience } });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center"
      style={{ background: "#FBF9F9", paddingBottom: 64 }}>

      <div className="w-full flex-shrink-0" style={{ background: "#FBF9F9", borderBottom: "1px solid black" }}>
        <div className="w-full mx-auto flex items-center justify-between px-4 md:px-16"
          style={{ maxWidth: 1280, paddingTop: 20, paddingBottom: 20 }}>
          <button onClick={() => navigate(-1)} className="flex items-center gap-3 hover:opacity-70 transition-opacity">
            <span style={{ color: "black", fontSize: 14 }}>←</span>
            <span style={{ color: "black", fontSize: 20, fontWeight: 400 }}>경험 기록하기</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col w-full px-4 md:px-0" style={{ maxWidth: 640, paddingTop: 24, gap: 32 }}>
        <p style={{ color: "#5D5F5F", fontSize: 16, fontWeight: 400, lineHeight: "26px" }}>
          작은 경험이라도 차곡차곡 모이면 훌륭한 포트폴리오가 됩니다.<br className="hidden md:block" />
          기억이 생생할 때 자세히 기록해 보세요.
        </p>

        <div className="flex flex-col" style={{ gap: 28, paddingBottom: 48 }}>

          {/* ── 날짜 필드 ── */}
          <div className="flex flex-col" style={{ gap: 6 }}>
            <label style={{ color: "black", fontSize: 14, fontWeight: 600, letterSpacing: 0.70 }}>
              활동 기간
            </label>
            <div className="flex items-center gap-3">
              <input
                type="month"
                value={form.start_date}
                onChange={(e) => handleChange("start_date", e.target.value)}
                style={{ flex: 1, borderBottom: "1px solid #6B7280", padding: "8px", fontSize: 14, color: "#1B1C1C", background: "transparent", outline: "none" }}
              />
              <span style={{ color: "#5D5F5F", fontSize: 13 }}>~</span>
              <input
                type="month"
                value={form.end_date}
                onChange={(e) => handleChange("end_date", e.target.value)}
                style={{ flex: 1, borderBottom: "1px solid #6B7280", padding: "8px", fontSize: 14, color: "#1B1C1C", background: "transparent", outline: "none" }}
              />
            </div>
            <p style={{ fontSize: 11, color: "#C6C6C7", marginTop: 2 }}>진행 중인 활동이라면 종료일을 비워도 돼요.</p>
          </div>

          {/* ── 기존 필드들 ── */}
          {fields.map((field) => (
            <div key={field.key} className="flex flex-col" style={{ gap: 6 }}>
              <label htmlFor={field.key}
                style={{ color: "black", fontSize: 14, fontWeight: 600, letterSpacing: 0.70 }}>
                {field.label}
              </label>
              <div style={{ paddingTop: 8, paddingBottom: field.rows === 1 ? 6 : 24, background: "white", borderBottom: `1px solid ${field.borderColor}` }}>
                <textarea
                  id={field.key}
                  value={form[field.key]}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full bg-transparent outline-none"
                  style={{
                    color: "#1B1C1C", fontSize: 14, fontWeight: 400, lineHeight: "22px",
                    paddingLeft: 8, paddingRight: 8, resize: "none", overflow: "hidden",
                    minHeight: field.key === "role" ? 32 : 80,
                  }}
                  onInput={(e) => {
                    e.target.style.height = "auto";
                    e.target.style.height = e.target.scrollHeight + "px";
                  }}
                />
              </div>
            </div>
          ))}

          <button onClick={handleSave} disabled={saving}
            className="w-full flex items-center justify-center hover:opacity-80 transition-opacity disabled:opacity-50"
            style={{ background: "black", padding: "14px 24px", color: "white", fontSize: 15, fontWeight: 400 }}>
            {saving ? "저장 중이에요..." : "저장할게요"}
          </button>
        </div>
      </div>
    </div>
  );
};