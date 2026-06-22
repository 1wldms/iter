import { useState } from "react";
import { useNavigate } from "react-router-dom";

const mockExperiences = [
  {
    id: 1,
    category: "RESEARCH",
    title: "사용자 경험 리서치: 학내 커뮤니티 재설계",
    period: "2023.09 - 2023.12",
    role: "메인 UI/UX 디자이너 & 정성 조사 리더",
    background: "파편화된 학내 공지사항 시스템으로 인해 정보 소외를 겪는 신입생들의 문제를 해결하고자 시작했습니다.",
    action: "총 15명의 심층 인터뷰를 진행하고, 어피니티 다이어그램을 통해 '통합 알림 서비스'의 필요성을 도출했습니다.",
    results: "베타 서비스 출시 후 사용자 만족도 85% 달성, 일일 활성 사용자 수 300명 돌파라는 유의미한 성과를 거두었습니다.",
    linkLabel: "Best Experience",
  },
  {
    id: 2,
    category: "BRANDING",
    title: "IT 창업 동아리 브랜드 아이덴티티 구축",
    period: "2024.03 - 2024.06",
    role: "브랜드 전략가 & 그래픽 디자이너",
    background: "동아리의 정체성이 모호하여 신규 부원 모집에 어려움을 겪던 시기, 강력한 비주얼 보이스가 필요했습니다.",
    action: "'연결과 성장'이라는 키워드를 중심으로 로고, 전용 서체, 컬러 팔레트를 포함한 브랜드 가이드라인을 제작했습니다.",
    results: "이전 기수 대비 지원율 150% 증가, 동아리 대외 활동 시 전문성 있는 이미지를 구축하는 데 기여했습니다.",
    linkLabel: "Portfolios",
  },
  {
    id: 3,
    category: "ENGINEERING",
    title: "전공 서적 중고 거래 플랫폼 개발",
    period: "2023.01 - 2023.06",
    role: "프론트엔드 엔지니어",
    background: "비싼 전공 서적 구매 부담을 줄이기 위해 학생 전용의 안전한 직거래 창구가 필요했습니다.",
    action: "React와 Tailwind CSS를 활용해 반응형 웹을 구현하고, 실시간 채팅 기능을 도입해 사용자 편의성을 높였습니다.",
    results: "출시 3개월 만에 500건 이상의 거래를 성사시켰으며, 학내 서비스 공모전에서 우수상을 수상했습니다.",
    linkLabel: "GitHub Repo",
  },
];

const CARD_WIDTH = 432;

const ExperienceCard = ({ exp, onClick }) => (
  <div
    onClick={onClick}
    className="cursor-pointer flex-shrink-0 flex flex-col"
    style={{
      width: CARD_WIDTH,
      height: 720,
      padding: 32,
      background: "white",
      outline: "1px solid black",
      outlineOffset: -1,
    }}
  >
    {/* 상단: 카테고리 + 제목 + 기간 */}
    <div className="flex flex-col gap-1 mb-4" style={{ minHeight: 175 }}>
      <span
        className="inline-block self-start px-2 py-1 text-xs font-semibold uppercase"
        style={{
          outline: "1px solid #7E7576",
          outlineOffset: -1,
          color: "#1B1C1C",
          fontSize: 14,
          fontFamily: "'Inter', sans-serif",
          fontWeight: 600,
          letterSpacing: 0.70,
          lineHeight: "16.8px",
        }}
      >
        {exp.category}
      </span>
      <h2
        style={{
          color: "#1B1C1C",
          fontSize: 32,
          fontWeight: 400,
          lineHeight: "41.6px",
          paddingTop: 9,
        }}
      >
        {exp.title}
      </h2>
      <p style={{ color: "#5D5F5F", fontSize: 16, fontFamily: "'Inter', sans-serif", fontWeight: 400, lineHeight: "24px" }}>
        {exp.period}
      </p>
    </div>

    {/* 본문: Role / Background / Action / Results */}
    <div className="flex-1 overflow-hidden relative">
      {[
        { label: "Role", value: exp.role, top: 0 },
        { label: "Background", value: exp.background, top: 68 },
        { label: "Action", value: exp.action, top: 185 },
      ].map((item) => (
        <div
          key={item.label}
          className="absolute flex flex-col gap-1"
          style={{ left: 0, top: item.top, width: 326 }}
        >
          <p style={{ color: "#1B1B1B", fontSize: 14, fontFamily: "'Inter', sans-serif", fontWeight: 600, lineHeight: "16.8px", letterSpacing: 0.70 }}>
            {item.label}
          </p>
          <p style={{ color: "#1B1C1C", fontSize: 16, fontWeight: 400, lineHeight: "24px" }}>
            {item.value}
          </p>
        </div>
      ))}

      {/* Results — 구분선 위에 */}
      <div
        className="absolute flex flex-col gap-1"
        style={{ left: 0, top: 302, width: 326, paddingTop: 15, borderTop: "1px solid rgba(0,0,0,0.10)" }}
      >
        <p style={{ color: "#1B1B1B", fontSize: 14, fontFamily: "'Inter', sans-serif", fontWeight: 600, lineHeight: "16.8px", letterSpacing: 0.70 }}>
          Results
        </p>
        <p style={{ color: "#1B1C1C", fontSize: 16, fontWeight: 400, lineHeight: "24px" }}>
          {exp.results}
        </p>
      </div>
    </div>

    {/* 하단: 링크 + 자세히 보러가기 */}
    <div style={{ paddingTop: 24 }}>
      <div
        className="flex items-center justify-between"
        style={{ paddingTop: 16, borderTop: "1px solid black" }}
      >
        <span style={{ color: "#1B1C1C", fontSize: 14, fontFamily: "'Inter', sans-serif", fontWeight: 600, lineHeight: "16.8px", letterSpacing: 0.70 }}>
          {exp.linkLabel}
        </span>
        <span style={{ color: "#1B1C1C", fontSize: 16, fontWeight: 400, lineHeight: "16px" }}>
          자세히 보러가기
        </span>
      </div>
    </div>
  </div>
);

const AddCard = ({ onClick }) => (
  <div
    onClick={onClick}
    className="cursor-pointer flex-shrink-0 flex flex-col items-center justify-center gap-6"
    style={{
      width: CARD_WIDTH,
      height: 720,
      padding: "32px 99px",
      background: "#F5F3F3",
      outline: "1px solid #C6C6C7",
      outlineOffset: -1,
    }}
  >
    <div style={{ width: 50, height: 50, background: "#C6C6C7" }} />
    <p className="text-center" style={{ color: "#5D5F5F", fontSize: 32, fontWeight: 400, lineHeight: "41.6px" }}>
      새로운 경험을<br />추가할까요?
    </p>
  </div>
);

export const ExperienceList = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const total = mockExperiences.length + 1; // 카드 + 추가 카드

  const prev = () => setCurrent((c) => Math.max(0, c - 1));
  const next = () => setCurrent((c) => Math.min(total - 1, c + 1));

  return (
    <div
      className="w-full min-h-screen flex flex-col"
      style={{ background: "linear-gradient(0deg, #FBF9F9 0%, #FBF9F9 100%), white" }}
    >
      {/* 플로팅 상단 바 */}
      <div
        className="fixed top-0 left-0 right-0 z-50"
        style={{ background: "rgba(251,249,249,0.80)", backdropFilter: "blur(6px)" }}
      >
        <div
          className="w-full mx-auto flex items-center justify-between"
          style={{ maxWidth: 1280, padding: "24px 64px" }}
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 hover:opacity-70 transition-opacity"
          >
            <span style={{ color: "#1B1C1C", fontSize: 16, fontWeight: 400, lineHeight: "16px" }}>
              ← 돌아가기
            </span>
          </button>
          <span
            style={{
              color: "black",
              fontSize: 32,
              fontFamily: "'Playfair Display', serif",
              fontWeight: 600,
              lineHeight: "41.6px",
            }}
          >
            ITER
          </span>
          <button className="w-12 h-12 flex items-end justify-center">
            <span style={{ color: "#1B1C1C", fontSize: 20, fontWeight: 400 }}>⋮</span>
          </button>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <main className="flex flex-col" style={{ paddingTop: 96 }}>
        {/* 타이틀 */}
        <div className="flex flex-col items-center gap-2 pb-16 pt-8">
          <h1
            className="text-center"
            style={{ color: "#1B1C1C", fontSize: 48, fontWeight: 400, lineHeight: "57.6px" }}
          >
            모든 경험을 펼쳐보아요
          </h1>
          <p className="text-center" style={{ color: "#5D5F5F", fontSize: 16, fontWeight: 400, lineHeight: "24px" }}>
            당신이 정성스럽게 엮어온 소중한 기록들입니다.<br />
            하나씩 넘겨보며 당신의 스토리를 확인해보세요.
          </p>
        </div>

        {/* 카드 슬라이더 */}
        <div className="relative" style={{ paddingTop: 69, paddingBottom: 69 }}>
          <div className="overflow-hidden" style={{ height: 720 }}>
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(calc(128px - ${current * CARD_WIDTH}px))` }}
            >
              {mockExperiences.map((exp) => (
                <ExperienceCard
                  key={exp.id}
                  exp={exp}
                  onClick={() => navigate(`/experiences/${exp.id}`)}
                />
              ))}
              <AddCard onClick={() => navigate("/experiences/add")} />
            </div>
          </div>

          {/* 좌우 화살표 */}
          <div
            className="absolute inset-x-4 flex items-center justify-between pointer-events-none"
            style={{ top: "calc(50% + 69px - 28px)" }}
          >
            <button
              onClick={prev}
              disabled={current === 0}
              className="pointer-events-auto flex items-center justify-center transition-opacity"
              style={{
                width: 56, height: 56,
                background: "#FBF9F9",
                outline: "1px solid black",
                outlineOffset: -1,
                opacity: current === 0 ? 0.3 : 1,
              }}
            >
              <span style={{ fontSize: 18, color: "#1B1C1C" }}>‹</span>
            </button>
            <button
              onClick={next}
              disabled={current >= total - 1}
              className="pointer-events-auto flex items-center justify-center transition-opacity"
              style={{
                width: 56, height: 56,
                background: "#FBF9F9",
                outline: "1px solid black",
                outlineOffset: -1,
                opacity: current >= total - 1 ? 0.3 : 1,
              }}
            >
              <span style={{ fontSize: 18, color: "#1B1C1C" }}>›</span>
            </button>
          </div>
        </div>

        {/* SCROLLED TO EXPLORE */}
        <div className="flex flex-col items-center gap-4 pt-12">
          <div className="relative" style={{ width: 200, height: 1, background: "black" }}>
            <div className="absolute" style={{ width: 50, height: 3, top: -1, left: 0, background: "black" }} />
          </div>
          <span
            style={{
              color: "#5D5F5F",
              fontSize: 14,
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              textTransform: "uppercase",
              lineHeight: "16.8px",
              letterSpacing: 1.40,
            }}
          >
            SCROLLED TO EXPLORE
          </span>
        </div>
      </main>

      {/* 푸터 */}
      <footer
        className="flex items-center justify-between mt-16"
        style={{ paddingLeft: 64, paddingRight: 64, paddingTop: 48, paddingBottom: 48, background: "white", borderTop: "1px solid black" }}
      >
        <span
          style={{
            color: "#1B1C1C",
            fontSize: 32,
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700,
            lineHeight: "41.6px",
          }}
        >
          ITER
        </span>
        <p style={{ color: "#1B1C1C", fontSize: 16, fontFamily: "'Inter', sans-serif", fontWeight: 400, lineHeight: "24px" }}>
          © 2026 Stitch. 당신의 성장을 응원합니다.
        </p>
        <div className="flex items-center gap-6">
          {["이용약관", "개인정보처리방침", "문의하기"].map((t) => (
            <button key={t} style={{ color: "#5D5F5F", fontSize: 16, fontWeight: 400, lineHeight: "24px" }}>
              {t}
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
};
