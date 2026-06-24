import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "../components/AppHeader";
import { authFetch } from "../auth";

const KEYWORD_COLORS = [
  { bg: "#FDECEC", text: "#977171" }, // 레드
  { bg: "#FEF3E2", text: "#857948" }, // 옐로우
  { bg: "#cbdfcd", text: "#638866" }, // 그린
  { bg: "#E3F2FD", text: "#647382" }, // 블루
  { bg: "#cdfaf5", text: "#566e6b" }, // 민트
];

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5001";

const ExperienceCard = ({ exp, onClick }) => (
  <div onClick={onClick} className="cursor-pointer hover:shadow-md transition-shadow"
    style={{ padding: 20, background: "white", outline: "1px solid black", outlineOffset: -1, display: "flex", flexDirection: "column", gap: 6, height: 200, overflow: "hidden" }}>
    <div className="flex items-center justify-between">
      <span className="px-2 py-1"
        style={{ borderRadius: 8, outline: "1px solid #7E7576", outlineOffset: -1, color: "#4C4546", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.70 }}>
        {exp.role || "경험"}
      </span>
      <span style={{ color: "#5D5F5F", fontSize: 11, fontWeight: 600, letterSpacing: 0.70 }}>
        기록일: {new Date(exp.created_at).toLocaleDateString("ko-KR")}
      </span>
    </div>
    <h3 style={{ color: "black", fontSize: 18, fontWeight: 400, lineHeight: "26px", paddingTop: 4, flex: 1 }}>
      {exp.title || exp.role || "제목 없음"}
    </h3>
    <div className="flex gap-2 flex-wrap">
      {(exp.keywords && exp.keywords.length > 0)
        ? exp.keywords.map((kw, i) => {
            const color = KEYWORD_COLORS[i % KEYWORD_COLORS.length];
            return (
              <span key={i} style={{ background: color.bg, color: color.text, fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 4 }}>
                #{kw}
              </span>
            );
          })
        : <p style={{ color: "#C6C6C7", fontSize: 12 }}>키워드가 아직 없어요</p>
      }
    </div>
  </div>
);

export const Dashboard = () => {
  const navigate = useNavigate();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await authFetch(`${BACKEND_URL}/experiences`);
        if (res.status === 401) { navigate("/login"); return; }
        const data = await res.json();
        setExperiences(data.experiences || []);
      } catch {
        console.error("경험 불러오기 실패");
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col" style={{ background: "#FBF9F9" }}>
      <AppHeader />

      <main className="w-full mx-auto flex flex-col px-4 md:px-16"
        style={{ maxWidth: 1280, paddingTop: 40, paddingBottom: 80, gap: 24 }}>
        <div className="flex flex-col gap-1">
          <div className="flex items-end justify-between">
            <h1 style={{ color: "black", fontSize: 32, fontWeight: 400, lineHeight: "40px" }}>내 경험</h1>
            <button onClick={() => navigate("/experiences")} className="mb-1 px-3 py-1"
              style={{ outline: "1px solid black", outlineOffset: -1, color: "black", fontSize: 13, fontWeight: 400 }}>
              모두 보기
            </button>
          </div>
          <p style={{ color: "#4C4546", fontSize: 14, fontWeight: 400, lineHeight: "22px" }}>
            그동안 쌓아온 소중한 기록들을 모아두었어요.
          </p>
        </div>

        {loading ? (
          <p style={{ color: "#5D5F5F", fontSize: 14 }}>불러오는 중이에요...</p>
        ) : experiences.length === 0 ? (
          <div className="flex flex-col items-center justify-center" style={{ paddingTop: 60, gap: 12 }}>
            <p style={{ color: "#5D5F5F", fontSize: 16 }}>아직 기록된 경험이 없어요.</p>
            <button onClick={() => navigate("/experiences/add")}
              style={{ background: "black", color: "white", padding: "10px 20px", fontSize: 14 }}>
              첫 경험 기록하기
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {experiences.slice(0, 4).map((exp) => (
              <ExperienceCard key={exp.id} exp={exp} onClick={() => navigate(`/experiences/${exp.id}`)} />
            ))}
          </div>
        )}
      </main>

      <button onClick={() => navigate("/experiences/add")}
        className="fixed flex items-center justify-center hover:opacity-80 transition-opacity"
        style={{ right: 16, bottom: 16, width: 48, height: 48, background: "black", borderRadius: 10, color: "white", fontSize: 24, fontWeight: 300 }}
        aria-label="경험 추가하기">
        +
      </button>
    </div>
  );
};