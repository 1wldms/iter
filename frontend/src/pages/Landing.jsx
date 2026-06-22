import { useState } from "react";
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

const CARD_WIDTH = 230;
const CARD_GAP = 24;
const CARD_COUNT = 3;

export const Landing = () => {
  const navigate = useNavigate();
  const [sliderValue, setSliderValue] = useState(0); // 0~100

  // 슬라이더 값 → 카드 translateX 변환
  const maxScroll = (CARD_WIDTH + CARD_GAP) * (CARD_COUNT - 1);
  const translateX = -(sliderValue / 100) * maxScroll;

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "linear-gradient(0deg, #FBF9F9 0%, #FBF9F9 100%), white",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── 헤더 ── */}
      <div
        style={{
          width: "100%",
          height: 64,
          paddingLeft: 64,
          paddingRight: 64,
          background: "#FBF9F9",
          borderBottom: "1px solid black",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        {/* 로고 */}
        <span style={{ color: "black", fontSize: 32, fontFamily: "'Playfair Display', serif", fontWeight: 700, lineHeight: "41.6px" }}>
          ITER
        </span>

        {/* 네비 */}
        <div style={{ display: "flex", alignItems: "center" }}>
          {["Card", "Insights", "Archive"].map((item) => (
            <div key={item} style={{ paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8 }}>
              <span style={{ color: "#5D5F5F", fontSize: 14, fontFamily: "'Playfair Display', serif", fontWeight: 600, lineHeight: "16.8px", letterSpacing: 0.70 }}>
                {item}
              </span>
            </div>
          ))}
        </div>

        {/* 버튼 */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            onClick={() => navigate("/login")}
            style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 8, paddingBottom: 8, outline: "1px solid black", outlineOffset: -1, color: "black", fontSize: 16, fontWeight: 400, lineHeight: "16px" }}
          >
            로그인
          </button>
          <button
            onClick={() => navigate("/login")}
            style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 8, paddingBottom: 8, background: "black", color: "white", fontSize: 16, fontWeight: 400, lineHeight: "16px" }}
          >
            시작하기
          </button>
        </div>
      </div>

      {/* ── 히어로 섹션 ── */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          paddingLeft: 64,
          paddingRight: 64,
          paddingTop: 90,
          paddingBottom: 60,
          display: "flex",
          alignItems: "center",
          gap: 64,
        }}
      >
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
            style={{ alignSelf: "flex-start", marginTop: 8, paddingLeft: 32, paddingRight: 32, paddingTop: 16, paddingBottom: 16, background: "black", display: "flex", alignItems: "center", gap: 8 }}
          >
            <span style={{ color: "white", fontSize: 16, fontWeight: 400, lineHeight: "16px" }}>지금 시작해요</span>
            <img src={iconArrowRight} alt="" aria-hidden="true" style={{ width: 16, height: 16 }} />
          </button>
        </div>

        {/* 우측 카드 */}
        <div style={{ flex: "1 1 0", minWidth: 0, height: 400, position: "relative", overflow: "hidden" }}>
          {/* 카드 flex row */}
          <div style={{ display: "flex", gap: 24, height: 400, paddingTop: 16, paddingBottom: 16, transform: `translateX(${translateX}px)`, transition: "transform 0.3s ease" }}>
            {featureCards.map((card, i) => (
              <div
                key={i}
                style={{
                  flexShrink: 0,
                  width: 230,
                  padding: 24,
                  background: "white",
                  outline: "1px solid black",
                  outlineOffset: -1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                {/* 아이콘 */}
                <div style={{ paddingBottom: 8 }}>
                  <div style={{ width: 48, height: 48, background: "#FBF9F9", borderRadius: 12, outline: "1px solid black", outlineOffset: -1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <img src={card.icon} alt="" aria-hidden="true" style={{ width: 20, height: 20 }} />
                  </div>
                </div>

                {/* 제목 */}
                <div style={{ color: "black", fontSize: 24, fontWeight: 400, lineHeight: "32px" }}>
                  {card.title}
                </div>

                {/* 설명 */}
                <div style={{ flex: "1 1 0", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                  <div style={{ color: "#5D5F5F", fontSize: 14, fontWeight: 400, lineHeight: "22px" }}>
                    {card.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 우측 페이드 */}
          <div style={{ position: "absolute", right: 0, top: 0, width: 64, height: "100%", background: "linear-gradient(270deg, #FBF9F9 0%, rgba(251,249,249,0) 100%)", pointerEvents: "none" }} />
        </div>
      </div>

      {/* ── 하단 슬라이더 ── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          paddingBottom: 64,
          marginTop: "auto",
        }}
      >
        {/* 드래그 힌트 화살표 — 슬라이더 건드리면 사라짐 */}
        {sliderValue === 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {[0, 1, 2].map((i) => (
              <svg
                key={i}
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                style={{ animation: `hint-arrow 1.4s ${i * 0.22}s ease-in-out infinite` }}
              >
                <path d="M1 5H9M6 2L9 5L6 8" stroke="#7E7576" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ))}
          </div>
        )}

        {/* 슬라이더 바 */}
        <div style={{ position: "relative", width: 200, height: 12, display: "flex", alignItems: "center" }}>
          {/* 트랙 배경 */}
          <div style={{ position: "absolute", width: "100%", height: 1, background: "#7E7576" }} />
          {/* 채워진 부분 */}
          <div style={{ position: "absolute", left: 0, height: 3, top: "50%", transform: "translateY(-50%)", width: `${sliderValue}%`, background: "black", transition: "width 0.3s ease" }} />
          {/* range input */}
          <input
            type="range"
            min={0}
            max={100}
            value={sliderValue}
            onChange={(e) => setSliderValue(Number(e.target.value))}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              opacity: 0,
              cursor: "pointer",
              margin: 0,
            }}
          />
        </div>
      </div>

      <style>{`
        input[type=range] { -webkit-appearance: none; appearance: none; background: transparent; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 12px; background: black; border-radius: 50%; cursor: pointer; }

        @keyframes hint-arrow {
          0%   { opacity: 0; transform: translateX(-4px); }
          40%  { opacity: 1; transform: translateX(0px); }
          70%  { opacity: 0.6; transform: translateX(2px); }
          100% { opacity: 0; transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
};
