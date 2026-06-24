import { useNavigate } from "react-router-dom";
import iconArrowRight from "../assets/icon-arrow-right.svg";
import iconDashboard from "../assets/icon-dashboard.svg";
import iconAI from "../assets/icon-ai.svg";

const featureCards = [
  { icon: iconDashboard, title: "경험을 구조화해요", desc: "흩어진 활동 내역을 체계적으로 모아보세요." },
  { icon: iconAI, title: "AI가 나를 분석해요", desc: "기록된 내용을 바탕으로 나의 강점과 성장 포인트를 도출합니다." },
  { icon: iconDashboard, title: "명함 한 장으로 정리돼요", desc: "완성된 포트폴리오를 직관적인 요약본으로 공유하세요." },
];

export const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen flex flex-col" style={{ background: "#FBF9F9" }}>

      {/* 헤더 */}
      <div className="w-full flex-shrink-0 flex items-center justify-between px-4 md:px-16"
        style={{ height: 64, background: "#FBF9F9", borderBottom: "1px solid black" }}>
        <span style={{ color: "black", fontSize: 28, fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
          ITER
        </span>
        <nav className="hidden md:flex items-center">
          {[
            { label: "Card", path: "/profile" },
            { label: "Insights", path: "/insights" },
            { label: "Archive", path: "/dashboard" },
          ].map((item) => (
            <button key={item.label} onClick={() => navigate(item.path)}
              style={{ padding: "8px 12px", background: "transparent", color: "#5D5F5F", fontSize: 16, fontFamily: "'Playfair Display', serif", fontWeight: 600, letterSpacing: 0.70 }}>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate("/login")} className="hidden md:block"
            style={{ padding: "8px 16px", outline: "1px solid black", outlineOffset: -1, color: "black", fontSize: 15, fontWeight: 400 }}>
            로그인
          </button>
          <button onClick={() => navigate("/login")}
            style={{ padding: "8px 16px", background: "black", color: "white", fontSize: 14, fontWeight: 400 }}>
            시작하기
          </button>
        </div>
      </div>

      {/* 히어로 */}
      <div className="flex-1 w-full mx-auto flex flex-col md:flex-row md:items-end px-4 md:px-16 pt-12 pb-16 md:pb-32 gap-10 md:gap-20"
        style={{ maxWidth: 1280 }}>

        {/* 좌측 카피 */}
        <div className="flex flex-col gap-6 md:flex-shrink-0 md:w-72">
          <div style={{ color: "black", fontSize: "clamp(36px, 8vw, 52px)", fontFamily: "'Playfair Display', serif", fontWeight: 700, lineHeight: 1.3 }}>
            Welcome<br />to your ITER
          </div>
          <div style={{ color: "#5D5F5F", fontSize: 16, fontWeight: 400, lineHeight: "28px" }}>
            무심코 지날칠 수 있는 경험들을 기록하여 자신만의 스토리를 쌓아보아요!
          </div>
          <button onClick={() => navigate("/login")}
            className="flex items-center gap-2 self-start"
            style={{ padding: "14px 28px", background: "black" }}>
            <span style={{ color: "white", fontSize: 15, fontWeight: 400 }}>지금 시작해요</span>
            <img src={iconArrowRight} alt="" aria-hidden="true" style={{ width: 14, height: 14 }} />
          </button>
        </div>

        {/* 우측 카드 3개 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
          {featureCards.map((card, i) => (
            <div key={i} className="flex flex-col gap-4"
              style={{ padding: 24, background: "white", outline: "1px solid black", outlineOffset: -1, minHeight: 180 }}>
              <div style={{ width: 44, height: 44, background: "#FBF9F9", borderRadius: 12, outline: "1px solid black", outlineOffset: -1, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <img src={card.icon} alt="" aria-hidden="true" style={{ width: 20, height: 20 }} />
              </div>
              <div style={{ color: "black", fontSize: 18, fontWeight: 400, lineHeight: "28px" }}>{card.title}</div>
              <div style={{ color: "#5D5F5F", fontSize: 13, fontWeight: 400, lineHeight: "20px", marginTop: "auto" }}>{card.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
