import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../auth";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5001";
const CARD_WIDTH = 340;

export const ExperienceList = () => {
  const navigate = useNavigate();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
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
    fetchData();
  }, []);

  const total = experiences.length + 1;
  const prev = () => setCurrent((c) => Math.max(0, c - 1));
  const next = () => setCurrent((c) => Math.min(total - 1, c + 1));

  return (
    <div className="w-full min-h-screen flex flex-col" style={{ background: "#FBF9F9" }}>
      <div className="fixed top-0 left-0 right-0 z-50" style={{ background: "rgba(251,249,249,0.90)", backdropFilter: "blur(6px)", borderBottom: "1px solid #E2E2E2" }}>
        <div className="w-full mx-auto flex items-center justify-between" style={{ maxWidth: 1280, padding: "16px 24px" }}>
          <button onClick={() => navigate("/dashboard")} className="hover:opacity-70 transition-opacity">
            <span style={{ color: "#1B1C1C", fontSize: 14 }}>← 돌아가기</span>
          </button>
          <span style={{ color: "black", fontSize: 24, fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>ITER</span>
          <div style={{ width: 48 }} />
        </div>
      </div>

      <main className="flex flex-col" style={{ paddingTop: 72 }}>
        <div className="flex flex-col items-center gap-1 pb-6 pt-4">
          <h1 style={{ color: "#1B1C1C", fontSize: 24, fontWeight: 400, lineHeight: "32px" }}>
            모든 경험을 펼쳐보아요
          </h1>
          <p className="text-center" style={{ color: "#5D5F5F", fontSize: 13, fontWeight: 400, lineHeight: "20px" }}>
            당신이 정성스럽게 엮어온 소중한 기록들입니다. 하나씩 넘겨보며 당신의 스토리를 확인해보세요.
          </p>
        </div>

        {loading ? (
          <p className="text-center" style={{ color: "#5D5F5F", paddingTop: 60 }}>불러오는 중이에요...</p>
        ) : (
          <div className="relative" style={{ paddingTop: 32, paddingBottom: 32 }}>
            <div className="overflow-hidden" style={{ height: 520 }}>
              <div className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(calc(64px - ${current * (CARD_WIDTH + 16)}px))`, gap: 16 }}>

                <div onClick={() => navigate("/experiences/add")}
                  className="cursor-pointer flex-shrink-0 flex flex-col items-center justify-center gap-3"
                  style={{ width: CARD_WIDTH, height: 520, background: "#F5F3F3", outline: "1px solid #C6C6C7", outlineOffset: -1 }}>
                  <div style={{ width: 28, height: 28, background: "#C6C6C7" }} />
                  <p className="text-center" style={{ color: "#5D5F5F", fontSize: 14, fontWeight: 400 }}>새로운 경험을<br />추가할까요?</p>
                </div>

                {experiences.map((exp) => (
                  <div key={exp.id} onClick={() => navigate(`/experiences/${exp.id}`)}
                    className="cursor-pointer flex-shrink-0 flex flex-col"
                    style={{ width: CARD_WIDTH, height: 520, padding: 24, background: "white", outline: "1px solid black", outlineOffset: -1, overflowY: "auto", gap: 8 }}>
                    <div className="flex items-center justify-between">
                      <span style={{ outline: "1px solid #7E7576", outlineOffset: -1, color: "#1B1C1C", fontSize: 11, fontWeight: 600, padding: "2px 6px" }}>
                        {exp.role || "경험"}
                      </span>
                      <span style={{ color: "#5D5F5F", fontSize: 11 }}>{new Date(exp.created_at).toLocaleDateString("ko-KR")}</span>
                    </div>
                    <h2 style={{ color: "#1B1C1C", fontSize: 16, fontWeight: 400, lineHeight: "24px", marginTop: 4 }}>
                      {exp.title || exp.role || "제목 없음"}
                    </h2>
                    <div style={{ borderTop: "1px solid #E2E2E2" }} />
                    <p style={{ color: "#4C4546", fontSize: 11, fontWeight: 600 }}>배경</p>
                    <p style={{ color: "#1B1C1C", fontSize: 12, lineHeight: "18px" }}>{exp.background}</p>
                    <div style={{ borderTop: "1px solid #E2E2E2" }} />
                    <p style={{ color: "#4C4546", fontSize: 11, fontWeight: 600 }}>액션</p>
                    <p style={{ color: "#1B1C1C", fontSize: 12, lineHeight: "18px" }}>{exp.action}</p>
                    <div style={{ borderTop: "1px solid #E2E2E2" }} />
                    <p style={{ color: "#4C4546", fontSize: 11, fontWeight: 600 }}>결과</p>
                    <p style={{ color: "#1B1C1C", fontSize: 12, lineHeight: "18px" }}>{exp.result}</p>
                  </div>
                ))}
                
              </div>
            </div>

            <div className="absolute inset-x-4 flex items-center justify-between pointer-events-none"
              style={{ top: "50%" }}>
              <button onClick={prev} disabled={current === 0}
                className="pointer-events-auto flex items-center justify-center transition-opacity"
                style={{ width: 40, height: 40, background: "#FBF9F9", outline: "1px solid black", outlineOffset: -1, opacity: current === 0 ? 0.3 : 1 }}>
                <span style={{ fontSize: 16 }}>‹</span>
              </button>
              <button onClick={next} disabled={current >= total - 1}
                className="pointer-events-auto flex items-center justify-center transition-opacity"
                style={{ width: 40, height: 40, background: "#FBF9F9", outline: "1px solid black", outlineOffset: -1, opacity: current >= total - 1 ? 0.3 : 1 }}>
                <span style={{ fontSize: 16 }}>›</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};