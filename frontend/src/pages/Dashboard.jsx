import { useNavigate } from "react-router-dom";
import { AppHeader } from "../components/AppHeader";

const mockExperiences = [
  {
    id: 1,
    category: "UX RESEARCH",
    date: "2023.10.15",
    title: "교내 프로젝트 사용자 조사",
    role: "리서치 리드 및 인터뷰어",
    background:
      "학생 커뮤니티 앱 개편을 위해 20명의 재학생을 대상으로 심층 인터뷰를 기획하고 진행했어요. 인사이트를 도출하여 문제 정의 단계에 기여했습니다.",
  },
  {
    id: 2,
    category: "PRODUCT DESIGN",
    date: "2023.08.22",
    title: "스타트업 인턴십: 프로토타이핑",
    role: "UI/UX 디자인 인턴",
    background:
      "초기 핀테크 스타트업에서 온보딩 프로세스를 재설계했어요. 전환율을 높이기 위해 A/B 테스트를 위한 두 가지 버전의 고해상도 프로토타입을 제작했습니다.",
  },
  {
    id: 3,
    category: "DATA ANALYSIS",
    date: "2023.05.10",
    title: "공공데이터 활용 해커톤",
    role: "데이터 분석 및 시각화 담당",
    background:
      "서울시 대중교통 데이터를 분석하여 심야 버스 노선 최적화 방안을 제안했어요. 복잡한 데이터를 직관적으로 이해할 수 있도록 대시보드로 시각화하여 우수상을 수상했습니다.",
  },
];

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
    {/* 카테고리 + 날짜 */}
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
        {exp.category}
      </span>
      <span
        style={{
          color: "#5D5F5F",
          fontSize: 14,
          fontWeight: 600,
          lineHeight: "16.8px",
          letterSpacing: 0.70,
        }}
      >
        기록일: {exp.date}
      </span>
    </div>

    {/* 제목 */}
    <h3
      style={{
        color: "black",
        fontSize: 32,
        fontWeight: 400,
        lineHeight: "41.6px",
        paddingTop: 9,
      }}
    >
      {exp.title}
    </h3>

    {/* 역할 */}
    <div className="flex flex-col gap-1">
      <p style={{ color: "#4C4546", fontSize: 14, fontWeight: 400, lineHeight: "16.8px", letterSpacing: 0.70 }}>
        역할
      </p>
      <p style={{ color: "black", fontSize: 16, fontWeight: 400, lineHeight: "24px" }}>
        {exp.role}
      </p>
    </div>

    {/* 배경 요약 */}
    <div className="flex flex-col gap-1 pt-2">
      <p style={{ color: "#4C4546", fontSize: 14, fontWeight: 400, lineHeight: "16.8px", letterSpacing: 0.70 }}>
        배경 요약
      </p>
      <p style={{ color: "#1B1C1C", fontSize: 16, fontWeight: 400, lineHeight: "24px" }}>
        {exp.background}
      </p>
    </div>
  </div>
);

export const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div
      className="w-full min-h-screen flex flex-col"
      style={{ background: "linear-gradient(0deg, #FBF9F9 0%, #FBF9F9 100%), white" }}
    >
      <AppHeader />

      <main
        className="w-full mx-auto flex flex-col"
        style={{
          maxWidth: 1280,
          paddingTop: 96,
          paddingBottom: 128,
          paddingLeft: 64,
          paddingRight: 64,
          gap: 32,
        }}
      >
        {/* 헤더 영역 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-end justify-between">
            <h1 style={{ color: "black", fontSize: 48, fontWeight: 400, lineHeight: "57.6px" }}>
              내 경험
            </h1>
            <button
              onClick={() => navigate("/experiences")}
              className="mb-1 px-3 py-1"
              style={{
                outline: "1px solid black",
                outlineOffset: -1,
                color: "black",
                fontSize: 14,
                fontWeight: 400,
                lineHeight: "16.8px",
                letterSpacing: 0.70,
              }}
            >
              모두 보기
            </button>
          </div>
          <p style={{ color: "#4C4546", fontSize: 18, fontWeight: 400, lineHeight: "28.8px" }}>
            그동안 쌓아온 소중한 기록들을 모아두었어요.
          </p>
        </div>

        {/* 경험 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {mockExperiences.map((exp) => (
            <ExperienceCard
              key={exp.id}
              exp={exp}
              onClick={() => navigate(`/experiences/${exp.id}`)}
            />
          ))}
        </div>

        {/* 하단 구분선 */}
        <div className="flex justify-center pt-8">
          <div className="relative" style={{ width: 256, height: 1, background: "#CFC4C5" }}>
            <div
              className="absolute"
              style={{ width: 64, height: 3, top: -1, left: 0, background: "black" }}
            />
          </div>
        </div>
      </main>

      {/* FAB 추가 버튼 */}
      <button
        onClick={() => navigate("/experiences/add")}
        className="fixed flex items-center justify-center hover:opacity-80 transition-opacity"
        style={{
          right: 64,
          bottom: 64,
          width: 56,
          height: 56,
          background: "black",
          borderRadius: 12,
          boxShadow: "2px 2px 0px rgba(0,0,0,0.30)",
          color: "white",
          fontSize: 28,
          fontWeight: 300,
          lineHeight: 1,
        }}
        aria-label="경험 추가하기"
      >
        +
      </button>
    </div>
  );
};
