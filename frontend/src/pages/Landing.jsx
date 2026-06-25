import { useNavigate } from "react-router-dom";
import iconArrowRight from "../assets/icon-arrow-right.svg";
import iconDashboard from "../assets/icon-dashboard.svg";
import iconAI from "../assets/icon-ai.svg";

const featureCards = [
  { icon: iconDashboard, title: "경험을 구조화해요", desc: "역할, 배경, 액션, 결과까지 체계적인 틀로 경험을 기록해요. 흩어진 활동들이 하나의 포트폴리오로 쌓여요." },
  { icon: iconAI, title: "AI가 나를 분석해요", desc: "기록된 경험을 바탕으로 나의 강점과 성장 패턴을 도출해요. 키워드 클라우드와 타임라인으로 한눈에 볼 수 있어요." },
  { icon: iconDashboard, title: "명함 한 장으로 정리돼요", desc: "완성된 포트폴리오가 Card 페이지로 정리돼요. AI가 뽑은 한줄 소개로 나를 표현할 수 있어요." },
];

const ArchiveMockup = () => (
  <div style={{ background: "#FBF9F9", border: "1px solid #E2E2E2", borderRadius: 8, padding: 20 }}>
    <div style={{ marginBottom: 12, fontWeight: 600, color: "#1B1C1C", fontSize: 13 }}>내 경험</div>
    {[
      { role: "기획팀장 (팀원 4명)", title: "교내 UX 해커톤 기획팀장 경험", date: "2026년 3월 – 6월", tags: [{ t: "#리더십", bg: "#FDECEC", c: "#977171" }, { t: "#기획 능력", bg: "#FEF3E2", c: "#857948" }, { t: "#의사소통", bg: "#cbdfcd", c: "#638866" }] },
      { role: "서비스 기획자", title: "교내 창업 경진대회 팀장", date: "2026년 1월 – 3월", tags: [{ t: "#팀장", bg: "#E3F2FD", c: "#647382" }, { t: "#차별화", bg: "#cdfaf5", c: "#566e6b" }, { t: "#멘토링", bg: "#FDECEC", c: "#977171" }] },
    ].map((exp, i) => (
      <div key={i} style={{ background: "white", border: "1px solid black", padding: 12, marginBottom: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ border: "1px solid #7E7576", padding: "1px 6px", color: "#4C4546", fontSize: 10, borderRadius: 4 }}>{exp.role}</span>
          <span style={{ color: "#5D5F5F", fontSize: 10 }}>{exp.date}</span>
        </div>
        <div style={{ fontWeight: 400, color: "black", fontSize: 13, marginBottom: 8 }}>{exp.title}</div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {exp.tags.map((tag, j) => (
            <span key={j} style={{ background: tag.bg, color: tag.c, padding: "2px 8px", borderRadius: 4, fontSize: 11 }}>{tag.t}</span>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const InsightsMockup = () => (
  <div style={{ background: "#FBF9F9", border: "1px solid #E2E2E2", borderRadius: 8, padding: 20 }}>
    <div style={{ marginBottom: 16, fontWeight: 600, color: "#1B1C1C", fontSize: 13 }}>Insights</div>

    {/* 키워드 클라우드 */}
    <div style={{ fontSize: 10, color: "#5D5F5F", marginBottom: 12, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>자주 등장한 키워드</div>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20, padding: "8px 0" }}>
      {[
        { t: "#리더십", bg: "#FDECEC", c: "#977171", size: 16 },
        { t: "#기획 능력", bg: "#FEF3E2", c: "#857948", size: 14 },
        { t: "#의사소통", bg: "#cbdfcd", c: "#638866", size: 15 },
        { t: "#책임감", bg: "#E3F2FD", c: "#647382", size: 13 },
        { t: "#차별화", bg: "#cdfaf5", c: "#566e6b", size: 12 },
        { t: "#팀장", bg: "#FDECEC", c: "#977171", size: 13 },
      ].map((kw, i) => (
        <span key={i} style={{ background: kw.bg, color: kw.c, fontSize: kw.size, padding: "4px 10px", borderRadius: 14, whiteSpace: "nowrap", transform: i % 2 === 0 ? "rotate(-2deg)" : "rotate(2deg)", display: "inline-block" }}>{kw.t}</span>
      ))}
    </div>

    {/* 타임라인 */}
    <div style={{ fontSize: 10, color: "#5D5F5F", marginBottom: 10, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>경험 타임라인</div>
    {[
      { date: "26년 1월", title: "교내 창업 경진대회" },
      { date: "26년 3월", title: "교내 UX 해커톤" },
    ].map((item, i) => (
      <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
        <span style={{ fontSize: 10, color: "#5D5F5F", minWidth: 52, textAlign: "right" }}>{item.date}</span>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#1B1C1C", marginTop: 3 }} />
          {i < 1 && <div style={{ width: 1, height: 18, background: "#DBDAD9" }} />}
        </div>
        <span style={{ fontSize: 11, color: "black" }}>{item.title}</span>
      </div>
    ))}

    {/* AI 강점 분석 */}
    <div style={{ fontSize: 10, color: "#5D5F5F", margin: "16px 0 10px", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>AI 강점 분석</div>
    <div style={{ background: "white", border: "1px solid black", padding: 12, borderRadius: 2 }}>
      <p style={{ fontSize: 12, color: "#1B1C1C", lineHeight: "18px", marginBottom: 10 }}>
        팀의 방향을 명확히 설정하고 구성원의 의견을 조율하는 리더십이 돋보이는 분입니다.
      </p>
      <div style={{ display: "flex", gap: 6 }}>
        {[{ t: "리더십", bg: "#FDECEC", c: "#977171" }, { t: "기획력", bg: "#FEF3E2", c: "#857948" }, { t: "커뮤니케이션", bg: "#cbdfcd", c: "#638866" }].map((kw, i) => (
          <span key={i} style={{ background: kw.bg, color: kw.c, fontSize: 10, padding: "2px 8px", borderRadius: 10 }}>{kw.t}</span>
        ))}
      </div>
    </div>
  </div>
);

const CardMockup = () => (
  <div style={{ background: "white", border: "1px solid #E2E2E2", borderRadius: 8, overflow: "hidden" }}>
    <div style={{ background: "#FBF9F9", padding: "8px 16px", borderBottom: "1px solid #E2E2E2", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 14 }}>ITER</span>
      <div style={{ display: "flex", gap: 12 }}>
        {["Card", "Insights", "Archive"].map(l => <span key={l} style={{ fontSize: 10, color: "#5D5F5F", fontFamily: "'Playfair Display', serif" }}>{l}</span>)}
      </div>
    </div>
    <div style={{ padding: 32, display: "flex", gap: 24, alignItems: "flex-start", minHeight: 280 }}>
      <div style={{ flex: 1 }}>
        <div style={{ width: 24, height: 2, background: "black", marginBottom: 20 }} />
        <div style={{ fontSize: 40, fontWeight: 400, color: "black", marginBottom: 14 }}>김서연</div>
        <div style={{ fontSize: 13, color: "#5D5F5F", lineHeight: "22px" }}>
          데이터를 기반으로 문제를 정의하고<br />팀과 함께 실행하는 기획자
        </div>
      </div>
      <div style={{ borderLeft: "1px solid black", paddingLeft: 24, minWidth: 160 }}>
        {[
          { label: "사용 언어 / 스킬", value: "Python, Figma, SQL" },
          { label: "학교 / 학과", value: "연세대 경영학과" },
          { label: "링크", value: "github.com/seoyeon" },
          { label: "연락처", value: "seoyeon@gmail.com" },
        ].map((row, i) => (
          <div key={i} style={{ borderBottom: "1px solid #DBDAD9", paddingBottom: 12, marginBottom: 12 }}>
            <div style={{ fontSize: 10, color: "#5D5F5F", marginBottom: 4 }}>{row.label}</div>
            <div style={{ fontSize: 12, color: "black" }}>{row.value}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const steps = [
  {
    step: "01", tag: "Archive",
    title: "경험을 기록해요",
    desc: "어떤 역할을 맡았는지, 어떤 행동을 했는지, 무엇을 배웠는지 — 구조화된 틀로 경험을 남겨요. AI와 함께 대화하며 채울 수도 있어요.",
    mockup: <ArchiveMockup />,
  },
  {
    step: "02", tag: "Insights",
    title: "패턴을 발견해요",
    desc: "여러 경험에서 반복되는 키워드와 역할을 시각화해요. AI가 강점을 분석해서 내가 어떤 사람인지 데이터로 보여줘요.",
    mockup: <InsightsMockup />,
  },
  {
    step: "03", tag: "Card",
    title: "나를 한줄로 표현해요",
    desc: "AI가 경험들을 종합해서 강점을 분석하고, 한줄 소개로 압축해줘요. Card 페이지에 바로 반영돼요.",
    mockup: <CardMockup />,
  },
];

export const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col" style={{ background: "#FBF9F9" }}>

      {/* 헤더 */}
      <div className="w-full flex-shrink-0 flex items-center justify-between px-4 md:px-16"
        style={{ height: 64, background: "#FBF9F9", borderBottom: "1px solid black", position: "sticky", top: 0, zIndex: 10 }}>
        <span style={{ color: "black", fontSize: 28, fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>ITER</span>
        <nav className="hidden md:flex items-center">
          {[{ label: "Card", path: "/profile" }, { label: "Insights", path: "/insights" }, { label: "Archive", path: "/dashboard" }].map((item) => (
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
      <div className="w-full mx-auto flex flex-col md:flex-row md:items-center px-4 md:px-16 py-20 gap-10 md:gap-20"
        style={{ maxWidth: 1280, minHeight: "calc(100vh - 64px)" }}>
        <div className="flex flex-col gap-6 md:flex-shrink-0 md:w-72">
          <div style={{ color: "black", fontSize: "clamp(36px, 8vw, 52px)", fontFamily: "'Playfair Display', serif", fontWeight: 700, lineHeight: 1.3 }}>
            Welcome<br />to your<br />ITER
          </div>
          <div style={{ color: "#5D5F5F", fontSize: 16, fontWeight: 400, lineHeight: "28px" }}>
            무심코 지날칠 수 있는 경험들을 기록하여<br />자신만의 스토리를 쌓아보아요!
          </div>
          <button onClick={() => navigate("/login")} className="flex items-center gap-2 self-start"
            style={{ padding: "14px 28px", background: "black" }}>
            <span style={{ color: "white", fontSize: 15, fontWeight: 400 }}>지금 시작해요</span>
            <img src={iconArrowRight} alt="" aria-hidden="true" style={{ width: 14, height: 14 }} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
          {featureCards.map((card, i) => (
            <div key={i} className="flex flex-col gap-6"
              style={{ padding: 28, background: "white", outline: "1px solid black", outlineOffset: -1, minHeight: 320 }}>
              <div style={{ width: 44, height: 44, background: "#FBF9F9", borderRadius: 12, outline: "1px solid black", outlineOffset: -1, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <img src={card.icon} alt="" aria-hidden="true" style={{ width: 20, height: 20 }} />
              </div>
              <div style={{ color: "black", fontSize: 18, fontWeight: 400, lineHeight: "28px" }}>{card.title}</div>
              <div style={{ color: "#5D5F5F", fontSize: 14, fontWeight: 400, lineHeight: "22px", marginTop: "auto" }}>{card.desc}</div>
            </div>
          ))}
        </div>
      </div>
      {/* ── ITER 의미 섹션 ── */}
      <div style={{ borderTop: "1px solid black", borderBottom: "1px solid black", background: "#1B1C1C" }}>
        <div className="w-full mx-auto px-4 md:px-16 py-20 flex flex-col md:flex-row gap-16 items-start"
          style={{ maxWidth: 1280 }}>

          {/* 왼쪽: 단어 */}
          <div className="flex-shrink-0">
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(64px, 12vw, 120px)", fontWeight: 700, color: "white", lineHeight: 1, letterSpacing: -2 }}>
              ITER
            </div>
            <div style={{ fontSize: 13, color: "#7E7576", marginTop: 8, letterSpacing: 2 }}>
              /ˈiː.tɛr/
            </div>
          </div>

          {/* 오른쪽: 설명 */}
          <div className="flex flex-col gap-10 pt-2" style={{ flex: 1 }}>

            {/* 라틴어 어원 */}
            <div className="flex flex-col gap-3">
              <span style={{ fontSize: 10, fontWeight: 600, color: "#7E7576", letterSpacing: 2, textTransform: "uppercase" }}>
                Latin Origin
              </span>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {["길 (Way)", "여정 (Journey)", "행군"].map((word, i) => (
                  <span key={i} style={{ fontSize: 16, color: "white", fontWeight: 400, padding: "4px 14px", border: "1px solid #5D5F5F", borderRadius: 20 }}>
                    {word}
                  </span>
                ))}
              </div>
              <p style={{ fontSize: 14, color: "#C6C6C7", lineHeight: "24px", marginTop: 4 }}>
                라틴어 <em style={{ color: "white", fontStyle: "normal" }}>iter</em>는 단순한 이동이 아닌, 목적을 가진 여정을 뜻해요.<br />
                당신의 경험 하나하나가 모여 하나의 길이 됩니다.
              </p>
            </div>

            {/* 구분선 */}
            <div style={{ width: "100%", height: 1, background: "#3A3B3B" }} />

            {/* 영어 연상 */}
            <div className="flex flex-col gap-3">
              <span style={{ fontSize: 10, fontWeight: 600, color: "#7E7576", letterSpacing: 2, textTransform: "uppercase" }}>
                Also echoes
              </span>
              <div className="flex flex-col gap-4">
                {[
                  { word: "Itinerary", meaning: "여정의 기록 — 경험을 체계적으로 남기는 것" },
                  { word: "Eternity", meaning: "영원 — 흘러가는 순간을 영원히 기억하도록" },
                ].map((item, i) => (
                  <div key={i} className="flex items-baseline gap-4">
                    <span style={{ fontSize: 18, color: "white", fontFamily: "'Playfair Display', serif", fontWeight: 400, minWidth: 110 }}>
                      {item.word}
                    </span>
                    <span style={{ fontSize: 13, color: "#7E7576", lineHeight: "20px" }}>
                      {item.meaning}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
      {/* ── 섹션 2: How it works ── */}
      <div style={{ background: "white", borderTop: "1px solid black", borderBottom: "1px solid black" }}>
        <div className="w-full mx-auto px-4 md:px-16 py-20" style={{ maxWidth: 1280 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#5D5F5F", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
            How it works
          </p>
          <h2 style={{ fontSize: 32, fontWeight: 400, color: "black", marginBottom: 80, lineHeight: "44px" }}>
            3단계로 나를 정리해요
          </h2>

          <div className="flex flex-col" style={{ gap: 100 }}>
            {steps.map((s, i) => (
              <div key={i} className={`flex flex-col md:flex-row gap-16 items-center ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
                <div className="flex flex-col gap-4 md:w-80 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#C6C6C7", letterSpacing: 2 }}>{s.step}</span>
                    <span style={{ fontSize: 10, fontWeight: 600, color: "#5D5F5F", background: "#F0EEEE", padding: "2px 8px", borderRadius: 10 }}>{s.tag}</span>
                  </div>
                  <div style={{ width: 32, height: 1, background: "black" }} />
                  <h3 style={{ fontSize: 24, fontWeight: 400, color: "black", lineHeight: "34px" }}>{s.title}</h3>
                  <p style={{ fontSize: 15, color: "#5D5F5F", lineHeight: "26px" }}>{s.desc}</p>
                </div>
                <div className="flex-1 w-full">
                  {s.mockup}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 섹션 3: CTA ── */}
      <div className="w-full mx-auto px-4 md:px-16 py-28 flex flex-col items-center gap-6" style={{ maxWidth: 1280 }}>
        <h2 style={{ fontSize: 30, fontWeight: 400, color: "black", textAlign: "center", lineHeight: "44px" }}>
          지금 바로 나의 경험을<br />기록해볼까요?
        </h2>
        <p style={{ fontSize: 15, color: "#5D5F5F", textAlign: "center", lineHeight: "24px" }}>
          무료로 시작할 수 있어요. 회원가입 후 바로 첫 경험을 기록해보세요.
        </p>
        <button onClick={() => navigate("/login")} className="flex items-center gap-2"
          style={{ padding: "14px 32px", background: "black" }}>
          <span style={{ color: "white", fontSize: 15, fontWeight: 400 }}>시작하기</span>
          <img src={iconArrowRight} alt="" aria-hidden="true" style={{ width: 14, height: 14 }} />
        </button>
      </div>

    </div>
  );
};