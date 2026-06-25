import { useNavigate } from "react-router-dom";
import iconArrowRight from "../assets/icon-arrow-right.svg";
import iconDashboard from "../assets/icon-dashboard.svg";
import iconAI from "../assets/icon-ai.svg";

const featureCards = [
  { icon: iconDashboard, title: "경험을 구조화해요", desc: "역할, 배경, 액션, 결과까지 체계적인 틀로 경험을 기록해요. 흩어진 활동들이 하나의 포트폴리오로 쌓여요." },
  { icon: iconAI, title: "AI가 나를 분석해요", desc: "기록된 경험을 바탕으로 나의 강점과 성장 패턴을 도출해요. 키워드 클라우드와 타임라인으로 한눈에 볼 수 있어요." },
  { icon: iconDashboard, title: "명함 한 장으로 정리돼요", desc: "완성된 포트폴리오가 Card 페이지로 정리돼요. AI가 뽑은 한줄 소개로 나를 표현할 수 있어요." },
];

const steps = [
  {
    step: "01",
    title: "경험을 기록해요",
    desc: "어떤 역할을 맡았는지, 어떤 행동을 했는지, 무엇을 배웠는지 — 구조화된 틀로 경험을 남겨요. AI와 함께 대화하며 채울 수도 있어요.",
    tag: "Archive",
  },
  {
    step: "02",
    title: "패턴을 발견해요",
    desc: "여러 경험에서 반복되는 키워드와 역할을 시각화해요. 내가 어떤 사람인지 데이터로 보여줘요.",
    tag: "Insights",
  },
  {
    step: "03",
    title: "나를 한줄로 표현해요",
    desc: "AI가 경험들을 종합해서 강점을 분석하고, 한줄 소개로 압축해줘요. Card 페이지에 바로 반영돼요.",
    tag: "Card",
  },
];

export const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col" style={{ background: "#FBF9F9" }}>

      {/* 헤더 */}
      <div className="w-full flex-shrink-0 flex items-center justify-between px-4 md:px-16"
        style={{ height: 64, background: "#FBF9F9", borderBottom: "1px solid black", position: "sticky", top: 0, zIndex: 10 }}>
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

      {/* ── 섹션 1: 히어로 ── */}
      <div className="w-full mx-auto flex flex-col md:flex-row md:items-end px-4 md:px-16 pt-16 pb-20 gap-10 md:gap-20"
        style={{ maxWidth: 1280 }}>

        <div className="flex flex-col gap-6 md:flex-shrink-0 md:w-72">
          <div style={{ color: "black", fontSize: "clamp(36px, 8vw, 52px)", fontFamily: "'Playfair Display', serif", fontWeight: 700, lineHeight: 1.3 }}>
            Welcome<br />to your<br />ITER
          </div>
          <div style={{ color: "#5D5F5F", fontSize: 16, fontWeight: 400, lineHeight: "28px" }}>
            무심코 지날칠 수 있는 경험들을 기록하여<br />자신만의 스토리를 쌓아보아요!
          </div>
          <button onClick={() => navigate("/login")}
            className="flex items-center gap-2 self-start"
            style={{ padding: "14px 28px", background: "black" }}>
            <span style={{ color: "white", fontSize: 15, fontWeight: 400 }}>지금 시작해요</span>
            <img src={iconArrowRight} alt="" aria-hidden="true" style={{ width: 14, height: 14 }} />
          </button>
        </div>

        {/* 카드 3개 — 더 길게 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
          {featureCards.map((card, i) => (
            <div key={i} className="flex flex-col gap-6"
              style={{ padding: 28, background: "white", outline: "1px solid black", outlineOffset: -1, minHeight: 360 }}>
              <div style={{ width: 44, height: 44, background: "#FBF9F9", borderRadius: 12, outline: "1px solid black", outlineOffset: -1, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <img src={card.icon} alt="" aria-hidden="true" style={{ width: 20, height: 20 }} />
              </div>
              <div style={{ color: "black", fontSize: 18, fontWeight: 400, lineHeight: "28px" }}>{card.title}</div>
              <div style={{ color: "#5D5F5F", fontSize: 14, fontWeight: 400, lineHeight: "22px", marginTop: "auto" }}>{card.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 섹션 2: 사용 방법 ── */}
      <div style={{ background: "white", borderTop: "1px solid black", borderBottom: "1px solid black" }}>
        <div className="w-full mx-auto px-4 md:px-16 py-20" style={{ maxWidth: 1280 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#5D5F5F", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
            How it works
          </p>
          <h2 style={{ fontSize: 32, fontWeight: 400, color: "black", marginBottom: 56, lineHeight: "44px" }}>
            3단계로 나를 정리해요
          </h2>

          <div className="flex flex-col md:flex-row gap-6">
            {steps.map((s, i) => (
              <div key={i} className="flex flex-col gap-4 flex-1"
                style={{ padding: 28, outline: "1px solid #E2E2E2", outlineOffset: -1, background: "#FBF9F9" }}>
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#C6C6C7", letterSpacing: 2 }}>{s.step}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, color: "#5D5F5F", background: "#F0EEEE", padding: "2px 8px", borderRadius: 10, letterSpacing: 0.5 }}>
                    {s.tag}
                  </span>
                </div>
                <div style={{ width: 32, height: 1, background: "black" }} />
                <h3 style={{ fontSize: 18, fontWeight: 400, color: "black", lineHeight: "28px" }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: "#5D5F5F", lineHeight: "22px", marginTop: "auto" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 섹션 3: 최종 CTA ── */}
      <div className="w-full mx-auto px-4 md:px-16 py-24 flex flex-col items-center gap-6" style={{ maxWidth: 1280 }}>
        <h2 style={{ fontSize: 28, fontWeight: 400, color: "black", textAlign: "center", lineHeight: "40px" }}>
          지금 바로 나의 경험을<br />기록해볼까요?
        </h2>
        <p style={{ fontSize: 15, color: "#5D5F5F", textAlign: "center", lineHeight: "24px" }}>
          무료로 시작할 수 있어요. 회원가입 후 바로 첫 경험을 기록해보세요.
        </p>
        <button onClick={() => navigate("/login")}
          className="flex items-center gap-2"
          style={{ padding: "14px 32px", background: "black" }}>
          <span style={{ color: "white", fontSize: 15, fontWeight: 400 }}>시작하기</span>
          <img src={iconArrowRight} alt="" aria-hidden="true" style={{ width: 14, height: 14 }} />
        </button>
      </div>

    </div>
  );
};