import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../auth";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5001";

const fields = [
  {
    key: "role",
    label: "역할",
    placeholder: "프로젝트에서 내가 맡은 포지션이 뭐였나요?",
    rows: 1,
    borderColor: "#6B7280",
  },
  {
    key: "background",
    label: "배경",
    placeholder: "이 활동을 시작하게 된 계기나 당시 상황을 설명해 주세요.",
    rows: 4,
    borderColor: "#C6C6C7",
  },
  {
    key: "action",
    label: "액션",
    placeholder: "목표를 달성하기 위해 구체적으로 어떤 행동을 했나요?",
    rows: 5,
    borderColor: "#C6C6C7",
  },
  {
    key: "result",
    label: "결과",
    placeholder: "어떤 성과를 얻었나요? 정량적인 수치가 있다면 더욱 좋아요.",
    rows: 4,
    borderColor: "#C6C6C7",
  },
  {
    key: "learned",
    label: "배운 점",
    placeholder: "이 과정을 통해 새롭게 알게 되거나 깨달은 점은 무엇인가요?",
    rows: 4,
    borderColor: "#C6C6C7",
  },
  {
    key: "reflection",
    label: "느낀 점",
    placeholder: "힘들었던 점, 뿌듯했던 점 등 솔직한 감정을 적어주세요.",
    rows: 4,
    borderColor: "#C6C6C7",
  },
  {
    key: "memo",
    label: "기타 메모",
    placeholder: "추가로 남기고 싶은 기록이 있다면 자유롭게 작성해 주세요.",
    rows: 3,
    borderColor: "#C6C6C7",
  },
];

export const ExperienceAdd = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    role: "", background: "", action: "", result: "",
    learned: "", reflection: "", memo: "",
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
        navigate("/dashboard");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="w-full min-h-screen flex flex-col items-center"
      style={{ background: "linear-gradient(0deg, #FBF9F9 0%, #FBF9F9 100%), white", paddingBottom: 96 }}
    >
      {/* 상단 바 */}
      <div
        className="w-full flex-shrink-0"
        style={{ background: "#FBF9F9", borderBottom: "1px solid black" }}
      >
        <div
          className="w-full mx-auto flex items-center justify-between"
          style={{ maxWidth: 1280, padding: "32px 64px" }}
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-4 hover:opacity-70 transition-opacity"
          >
            <span style={{ color: "black", fontSize: 16, lineHeight: "16px" }}>←</span>
            <span style={{ color: "black", fontSize: 32, fontWeight: 400, lineHeight: "41.6px" }}>
              경험 기록하기
            </span>
          </button>
          <button
            onClick={() => navigate(-1)}
            style={{ color: "black", fontSize: 20, lineHeight: "20px" }}
            aria-label="닫기"
          >
            ×
          </button>
        </div>
      </div>

      {/* 폼 영역 */}
      <div
        className="flex flex-col"
        style={{ width: "100%", maxWidth: 768, paddingTop: 32, gap: 47 }}
      >
        {/* 안내 문구 */}
        <p style={{ color: "#5D5F5F", fontSize: 25, fontWeight: 400, lineHeight: "40px" }}>
          작은 경험이라도 차곡차곡 모이면 훌륭한 포트폴리오가 됩니다.<br />
          기억이 생생할 때 자세히 기록해 보세요.
        </p>

        {/* 입력 필드들 */}
        <div className="flex flex-col" style={{ gap: 47, paddingBottom: 64 }}>
          {fields.map((field) => (
            <div key={field.key} className="flex flex-col" style={{ gap: 8 }}>
              <label
                htmlFor={field.key}
                style={{
                  color: "black",
                  fontSize: 20,
                  fontWeight: 400,
                  lineHeight: "16.8px",
                  letterSpacing: 0.70,
                }}
              >
                {field.label}
              </label>
              <div
                style={{
                  paddingTop: 10,
                  paddingBottom: field.rows === 1 ? 8 : 56,
                  background: "white",
                  borderBottom: `1px solid ${field.borderColor}`,
                }}
              >
                <textarea
                  id={field.key}
                  rows={field.rows}
                  value={form[field.key]}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full resize-none bg-transparent outline-none"
                  style={{
                    color: "#1B1C1C",
                    fontSize: field.rows === 1 ? 16 : 20,
                    fontWeight: 400,
                    lineHeight: field.rows === 1 ? "24px" : "24px",
                    paddingLeft: 12,
                    paddingRight: 12,
                  }}
                />
              </div>
            </div>
          ))}

          {/* 저장 버튼 */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center hover:opacity-80 transition-opacity disabled:opacity-50"
            style={{
              background: "black",
              padding: "16px 24px",
              color: "white",
              fontSize: 20,
              fontWeight: 400,
              lineHeight: "16px",
            }}
          >
            {saving ? "저장 중이에요..." : "저장할게요"}
          </button>
        </div>
      </div>
    </div>
  );
};
