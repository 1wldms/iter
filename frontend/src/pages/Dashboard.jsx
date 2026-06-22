import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "../components/AppHeader";
import { authFetch } from "../auth";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5001";

const ExperienceCard = ({ exp, onClick }) => (
  <div
    onClick={onClick}
    className="cursor-pointer hover:shadow-md transition-shadow"
    style={{
      padding: 32,
      background: "white",
      outline: "1px solid black",
      outlineOffset: -1,
      display: "flex",
      flexDirection: "column",
      gap: 7,
    }}
  >
    <div className="flex items-center justify-between">
      <span
        className="px-3 py-1"
        style={{
          borderRadius: 12,
          outline: "1px solid #7E7576",
          outlineOffset: -1,
          color: "#4C4546",
          fontSize: 14,
          fontWeight: 600,
          textTransform: "uppercase",
          lineHeight: "16.8px",
          letterSpacing: 0.70,
        }}
      >
        {exp.role || "경험"}
      </span>
      <span style={{ color: "#5D5F5F", fontSize: 14, fontWeight: 600, lineHeight: "16.8px", letterSpacing: 0.70 }}>
        기록일: {new Date(exp.created_at).toLocaleDateString("ko-KR")}
      </span>
    </div>

    <h3 style={{ color: "black", fontSize: 28, fontWeight: 400, lineHeight: "36px", paddingTop: 9 }}>
      {exp.title || exp.role || "제목 없음"}
    </h3>

    <div className="flex flex-col gap-1">
      <p style={{ color: "#4C4546", fontSize: 14, fontWeight: 400, lineHeight: "16.8px", letterSpacing: 0.70 }}>역할</p>
      <p style={{ color: "black", fontSize: 16, fontWeight: 400, lineHeight: "24px" }}>{exp.role}</p>
    </div>

    <div className="flex flex-col gap-1 pt-2">
      <p style={{ color: "#4C4546", fontSize: 14, fontWeight: 400, lineHeight: "16.8px", letterSpacing: 0.70 }}>배경 요약</p>
      <p style={{ color: "#1B1C1C", fontSize: 16, fontWeight: 400, lineHeight: "24px" }}>
        {exp.background || "내용 없음"}
      </p>
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
        if (res.status === 401) {
          navigate("/login");
          return;
        }
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

      <main
        className="w-full mx-auto flex flex-col"
        style={{ maxWidth: 1280, paddingTop: 64, paddingBottom: 128, paddingLeft: 64, paddingRight: 64, gap: 32 }}
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-end justify-between">
            <h1 style={{ color: "black", fontSize: 48, fontWeight: 400, lineHeight: "57.6px" }}>내 경험</h1>
            <button
              onClick={() => navigate("/experiences")}
              className="mb-1 px-3 py-1"
              style={{ outline: "1px solid black", outlineOffset: -1, color: "black", fontSize: 14, fontWeight: 400 }}
            >
              모두 보기
            </button>
          </div>
          <p style={{ color: "#4C4546", fontSize: 18, fontWeight: 400, lineHeight: "28.8px" }}>
            그동안 쌓아온 소중한 기록들을 모아두었어요.
          </p>
        </div>

        {loading ? (
          <p style={{ color: "#5D5F5F", fontSize: 16 }}>불러오는 중이에요...</p>
        ) : experiences.length === 0 ? (
          <div className="flex flex-col items-center justify-center" style={{ paddingTop: 80, gap: 16 }}>
            <p style={{ color: "#5D5F5F", fontSize: 20 }}>아직 기록된 경험이 없어요.</p>
            <button
              onClick={() => navigate("/experiences/add")}
              style={{ background: "black", color: "white", padding: "12px 24px", fontSize: 16 }}
            >
              첫 경험 기록하기
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {experiences.slice(0, 4).map((exp) => (
              <ExperienceCard
                key={exp.id}
                exp={exp}
                onClick={() => navigate(`/experiences/${exp.id}`)}
              />
            ))}
          </div>
        )}
      </main>

      <button
        onClick={() => navigate("/experiences/add")}
        className="fixed flex items-center justify-center hover:opacity-80 transition-opacity"
        style={{
          right: 64, bottom: 64,
          width: 56, height: 56,
          background: "black", borderRadius: 12,
          color: "white", fontSize: 28, fontWeight: 300,
        }}
        aria-label="경험 추가하기"
      >
        +
      </button>
    </div>
  );
};