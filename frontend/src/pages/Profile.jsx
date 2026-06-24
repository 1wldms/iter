import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import iconArrowRight from "../assets/icon-arrow-right.svg";
import { AppHeader } from "../components/AppHeader";
import { saveToken, authFetch } from "../auth";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5001";

export const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        if (token) {
          saveToken(token);
          window.history.replaceState({}, '', '/profile');
        }
        const res = await authFetch(`${BACKEND_URL}/profile`);
        if (res.status === 401) { navigate("/login"); return; }
        const data = await res.json();
        setUser(data.user);
        setProfile(data.profile);
        if (!data.profile) navigate("/onboarding");
      } catch {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center" style={{ background: "#FBF9F9" }}>
        <p style={{ color: "#5D5F5F", fontSize: 16 }}>불러오는 중이에요...</p>
      </div>
    );
  }

  const displayName = user?.name || "이름 없음";
  const languages = profile?.languages?.join(", ") || "";
  const school = [profile?.school, profile?.department].filter(Boolean).join(" ") || "";
  const link = profile?.github_url || "";
  const contact = profile?.contact || "";
  const bio = profile?.bio_sentence || null;

  const infoRows = [
    { label: "사용 언어", value: languages },
    { label: "학교 / 학과", value: school },
    { label: "링크", value: link },
    { label: "연락처", value: contact },
  ];

  return (
    <div className="w-full bg-white flex flex-col" style={{ minHeight: "100vh" }}>
      <AppHeader />

      {/* ───── 모바일 레이아웃 ───── */}
      <div className="flex md:hidden flex-col px-6 pt-10 pb-16 gap-8">
        {/* 이름 상단 */}
        <div className="flex flex-col gap-3">
          <div style={{ width: 36, height: 3, background: "black" }} />
          <h1 style={{ color: "black", fontSize: 52, fontWeight: 400, lineHeight: "1.1" }}>
            {displayName}
          </h1>
          <p style={{ color: "#5D5F5F", fontSize: 15, fontWeight: 400, lineHeight: "24px" }}>
            {bio ?? "경험을 기록해주세요, 나를 표현하는 문장이 만들어집니다."}
          </p>
        </div>

        {/* 이력서(정보) 하단 */}
        <div className="flex flex-col gap-4" style={{ paddingLeft: 20, borderLeft: "1px solid black" }}>
          {infoRows.map((row) => (
            <div key={row.label} style={{ borderBottom: "1px solid #DBDAD9", paddingBottom: 12 }}>
              <p style={{ color: "#5D5F5F", fontSize: 13, fontWeight: 400, letterSpacing: 0.70, marginBottom: 4 }}>
                {row.label}
              </p>
              <p style={{ color: "black", fontSize: 16, fontWeight: 400, lineHeight: "24px" }}>
                {row.value}
              </p>
            </div>
          ))}
        </div>

        <button onClick={() => navigate("/dashboard")} className="flex items-center gap-3 hover:opacity-70 transition-opacity">
          <span style={{ color: "black", fontSize: 15, fontWeight: 400, textTransform: "uppercase" }}>
            대시보드 보기
          </span>
          <img src={iconArrowRight} alt="" aria-hidden="true" style={{ width: 13, filter: "brightness(0)" }} />
        </button>
      </div>

      {/* ───── 데스크톱 레이아웃 ───── */}
      <main className="hidden md:block relative flex-1 w-full mx-auto"
        style={{ maxWidth: 1280, height: "calc(100vh - 64px)", paddingLeft: 64, paddingRight: 64 }}>

        {/* 격자 배경 */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ opacity: 0.5, background: "linear-gradient(90deg, #E2E2E2 2%, rgba(226,226,226,0) 2%), linear-gradient(180deg, #E2E2E2 2%, rgba(226,226,226,0) 2%)" }} />

        {/* 우측 인포 패널 */}
        <div className="absolute" style={{ right: 100, top: "45%", transform: "translateY(-50%)" }}>
          <div className="flex flex-col gap-4"
            style={{ paddingTop: 16, paddingBottom: 16, paddingLeft: 32, borderLeft: "1px solid black", background: "white", width: 320 }}>
            {infoRows.map((row) => (
              <div key={row.label} style={{ borderBottom: "1px solid #DBDAD9", paddingBottom: 12 }}>
                <p style={{ color: "#5D5F5F", fontSize: 16, fontWeight: 400, letterSpacing: 0.70, marginBottom: 4 }}>
                  {row.label}
                </p>
                <p style={{ color: "black", fontSize: 20, fontWeight: 400, lineHeight: "28px" }}>
                  {row.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 좌측 하단 — 이름 + 한 문장 */}
        <div className="absolute flex flex-col" style={{ left: 104, bottom: 80, maxWidth: 700 }}>
          <div style={{ width: 48, height: 3, background: "black", marginBottom: 30 }} />
          <h1 style={{ color: "black", fontSize: 80, fontWeight: 400, lineHeight: "80px", marginBottom: 8 }}>
            {displayName}
          </h1>
          <p style={{ color: "#5D5F5F", fontSize: 18, fontWeight: 400, lineHeight: "26px", maxWidth: 500 }}>
            {bio ?? "경험을 기록해주세요, 나를 표현하는 문장이 만들어집니다."}
          </p>
        </div>

        {/* 대시보드 보기 */}
        <button onClick={() => navigate("/dashboard")}
          className="absolute flex items-center gap-4 hover:opacity-70 transition-opacity"
          style={{ right: 64, bottom: 90 }}>
          <span style={{ color: "black", fontSize: 17, fontWeight: 400, textTransform: "uppercase" }}>
            대시보드 보기
          </span>
          <img src={iconArrowRight} alt="" aria-hidden="true" style={{ width: 14, filter: "brightness(0)" }} />
        </button>
      </main>
    </div>
  );
};
