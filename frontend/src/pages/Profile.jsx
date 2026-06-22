import { useNavigate } from "react-router-dom";
import iconArrowRight from "../assets/icon-arrow-right.svg";
import { AppHeader } from "../components/AppHeader";

// 실제 서비스에서는 백엔드 /profile API에서 받아옴
const mockUser = {
  name: "김윤아",
  bio: null, // 경험이 쌓이면 AI가 생성
  languages: "Python, JavaScript, English",
  school: "한국대학교 컴퓨터공학부",
  link: "github.com/yuna-kim",
  contact: "hello@yunakim.com",
};

const infoRows = [
  { label: "사용 언어", value: mockUser.languages, font: "Inter" },
  { label: "학교 / 학과", value: mockUser.school, font: "A2Z" },
  { label: "링크", value: mockUser.link, font: "Inter" },
];

export const Profile = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-white flex flex-col">
      <AppHeader />

      {/* 메인 컨텐츠 */}
      <main
        className="relative flex-1 w-full mx-auto flex flex-col justify-end"
        style={{
          maxWidth: 1280,
          minHeight: 819,
          paddingTop: 497,
          paddingBottom: 128,
          paddingLeft: 64,
          paddingRight: 64,
        }}
      >
        {/* 격자 배경 */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.5,
            background:
              "linear-gradient(90deg, #E2E2E2 2%, rgba(226,226,226,0) 2%), linear-gradient(180deg, #E2E2E2 2%, rgba(226,226,226,0) 2%)",
          }}
        />

        {/* 우측 인포 패널 */}
        <div
          className="absolute"
          style={{ right: 64, bottom: 128 + 209 /* 이름 영역 높이만큼 */ }}
        >
          <div
            className="flex flex-col gap-6"
            style={{
              paddingTop: 16,
              paddingBottom: 16,
              paddingLeft: 32,
              borderLeft: "1px solid black",
              width: 335 + 32,
            }}
          >
            {infoRows.map((row) => (
              <div
                key={row.label}
                className="relative"
                style={{ borderBottom: "1px solid #DBDAD9", paddingBottom: 16 }}
              >
                <p
                  style={{
                    color: "#5D5F5F",
                    fontSize: 14,
                    fontFamily: "sans-serif",
                    fontWeight: 400,
                    lineHeight: "16.8px",
                    letterSpacing: 0.70,
                    marginBottom: 4,
                  }}
                >
                  {row.label}
                </p>
                <p
                  style={{
                    color: "black",
                    fontSize: 16,
                    fontFamily: row.font === "Inter" ? "'Inter', sans-serif" : "sans-serif",
                    fontWeight: 400,
                    lineHeight: "24px",
                  }}
                >
                  {row.value}
                </p>
              </div>
            ))}

            {/* 연락처 (보더 없음) */}
            <div>
              <p
                style={{
                  color: "#5D5F5F",
                  fontSize: 14,
                  fontFamily: "sans-serif",
                  fontWeight: 400,
                  lineHeight: "16.8px",
                  letterSpacing: 0.70,
                  marginBottom: 4,
                }}
              >
                연락처
              </p>
              <p
                style={{
                  color: "black",
                  fontSize: 16,
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  lineHeight: "24px",
                }}
              >
                {mockUser.contact}
              </p>
            </div>
          </div>
        </div>

        {/* 좌측 하단 — 이름 + 한 문장 */}
        <div className="relative flex flex-col" style={{ maxWidth: 760 }}>
          {/* 검은 선 */}
          <div style={{ width: 64, height: 4, background: "black", marginBottom: 32 }} />

          {/* 이름 */}
          <h1
            style={{
              color: "black",
              fontSize: 120,
              fontFamily: "sans-serif",
              fontWeight: 400,
              lineHeight: "120px",
              marginBottom: 24,
            }}
          >
            {mockUser.name}
          </h1>

          {/* 한 문장 (AI 생성 or 안내 문구) */}
          <p
            style={{
              color: "#5D5F5F",
              fontSize: 18,
              fontFamily: "sans-serif",
              fontWeight: 400,
              lineHeight: "28.8px",
              maxWidth: 448,
            }}
          >
            {mockUser.bio ?? "경험을 기록해주세요, 나를 표현하는 문장이 만들어집니다."}
          </p>
        </div>

        {/* 대시보드 보기 */}
        <button
          onClick={() => navigate("/dashboard")}
          className="absolute flex items-center gap-4 hover:opacity-70 transition-opacity"
          style={{ right: 64, bottom: 128 }}
        >
          <span
            style={{
              color: "black",
              fontSize: 14,
              fontFamily: "sans-serif",
              fontWeight: 400,
              textTransform: "uppercase",
              lineHeight: "16.8px",
              letterSpacing: 1.40,
            }}
          >
            대시보드 보기
          </span>
          <img src={iconArrowRight} alt="" aria-hidden="true" style={{ width: 16, filter: "brightness(0)" }} />
        </button>
      </main>
    </div>
  );
};
