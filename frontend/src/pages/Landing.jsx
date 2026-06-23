import { useNavigate } from "react-router-dom";
import iconArrowRight from "../assets/icon-arrow-right.svg";
import iconDashboard from "../assets/icon-dashboard.svg";
import iconAI from "../assets/icon-ai.svg";

const featureCards = [
  {
    icon: iconDashboard,
    title: "경험을 구조화해요",
    desc: "흩어진 활동 내역을 체계적으로 모아보세요.",
  },
  {
    icon: iconAI,
    title: "AI가 나를 분석해요",
    desc: "기록된 내용을 바탕으로 나의 강점과 성장 포인트를 도출합니다.",
  },
  {
    icon: iconDashboard,
    title: "명함 한 장으로 정리돼요",
    desc: "완성된 포트폴리오를 직관적인 요약본으로 공유하세요.",
  },
];

export const Landing = () => {
  const navigate = useNavigate();

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#FBF9F9", display: "flex", flexDirection: "column" }}>
      
      {/* 헤더 */}
      <div style={{ width: "100%", height: 64, paddingLeft: 64, paddingRight: 64, background: "#FBF9F9", borderBottom: "1px solid black", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <span style={{ color: "black", fontSize: 32, fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
          ITER
        </span>
        <div style={{ display: "flex", alignItems: "center" }}>
          {["Card", "Insights", "Archive"].map((item) => (
            <div key={item} style={{ padding: "8px 12px" }}>
              <span style={{ color: "#5D5F5F", fontSize: 14, fontFamily: "'Playfair Display', serif", fontWeight: 600, letterSpacing: 0.70 }}>
                {item}
              </span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={() => navigate("/login")} style={{ padding: "8px 16px", outline: "1px solid black", outlineOffset: -1, color: "black", fontSize: 16, fontWeight: 400 }}>
            로그인
          </button>
          <button onClick={() => navigate("/login")} style={{ padding: "8px 16px", background: "black", color: "white", fontSize: 16, fontWeight: 400 }}>
            시작하기
          </button>
        </div>
      </div>

      {/* 히어로 */}
      <div style={{ maxWidth: 1280, margin: "0 auto", width: "100%", paddingLeft: 64, paddingRight: 64, paddingTop: 90, paddingBottom: 80, display: "flex", alignItems: "center", gap: 80 }}>
        
        {/* 좌측 카피 */}
        <div style={{ flexShrink: 0, width: 300, display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ color: "black", fontSize: 52, fontFamily: "'Playfair Display', serif", fontWeight: 700, lineHeight: "64px" }}>
            Welcome<br />to your ITER
          </div>
          <div style={{ color: "#5D5F5F", fontSize: 18, fontWeight: 400, lineHeight: "28.8px" }}>
            무심코 지날칠 수 있는 경험들을 기록하여 자신만의 스토리를 쌓아보아요!
          </div>
          <button
            onClick={() => navigate("/login")}
            style={{ alignSelf: "flex-start", marginTop: 8, padding: "16px 32px", background: "black", display: "flex", alignItems: "center", gap: 8 }}
          >
            <span style={{ color: "white", fontSize: 16, fontWeight: 400 }}>지금 시작해요</span>
            <img src={iconArrowRight} alt="" aria-hidden="true" style={{ width: 16, height: 16 }} />
          </button>
        </div>

        {/* 우측 카드 3개 */}
        <div style={{ flex: "1 1 0", display: "flex", gap: 24 }}>
          {featureCards.map((card, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                padding: 28,
                background: "white",
                outline: "1px solid black",
                outlineOffset: -1,
                display: "flex",
                flexDirection: "column",
                gap: 16,
                minHeight: 320,
              }}
            >
              <div style={{ width: 48, height: 48, background: "#FBF9F9", borderRadius: 12, outline: "1px solid black", outlineOffset: -1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img src={card.icon} alt="" aria-hidden="true" style={{ width: 20, height: 20 }} />
              </div>
              <div style={{ color: "black", fontSize: 22, fontWeight: 400, lineHeight: "30px" }}>
                {card.title}
              </div>
              <div style={{ color: "#5D5F5F", fontSize: 14, fontWeight: 400, lineHeight: "22px", marginTop: "auto" }}>
                {card.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};