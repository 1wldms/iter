import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  { label: "Card", path: "/profile" },
  { label: "Insights", path: "/insights" },
  { label: "Archive", path: "/dashboard" },
];

export const AppHeader = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
      await fetch(`${import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5001"}/auth/logout`, {
          method: "POST",
          credentials: "include",
      });
      localStorage.removeItem('access_token');
      navigate("/");
  };

  return (
    <header className="w-full flex-shrink-0" style={{ background: "#FBF9F9", borderBottom: "1px solid black" }}>
      <div className="w-full mx-auto relative flex items-center justify-between px-4 md:px-16"
        style={{ maxWidth: 1280, height: 64 }}>

        {/* 로고 */}
        <button onClick={() => navigate("/profile")}
          style={{ color: "black", fontSize: 32, fontFamily: "'Playfair Display', serif", fontWeight: 700, lineHeight: "41.6px" }}>
          ITER
        </button>

        {/* 데스크톱 네비게이션 — 절대 중앙 */}
        <nav className="hidden md:flex items-stretch h-full absolute left-1/2 -translate-x-1/2">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <button key={item.label} onClick={() => navigate(item.path)}
                className="flex items-center px-6 h-full"
                style={isActive ? { borderBottom: "2px solid black", marginBottom: "-1px" } : {}}>
                <span style={{ color: isActive ? "black" : "#5D5F5F", fontSize: 17, fontFamily: "'Playfair Display', serif", fontWeight: isActive ? 900 : 600, letterSpacing: 0.70 }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* 데스크톱 버튼 */}
        <div className="hidden md:flex items-center gap-4">
            <button
                onClick={() => navigate("/")}
                style={{ width: 32, height: 32, borderRadius: "50%", outline: "1px solid #C6C6C7", outlineOffset: -1, color: "#5D5F5F", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center" }}
                title="사용 방법 보기"
            >
                ?
            </button>
            <button onClick={handleLogout} className="whitespace-nowrap px-6 py-3"
                style={{ borderRadius: 2, outline: "1px solid black", outlineOffset: -1, color: "black", fontSize: 14, fontWeight: 400 }}>
                로그아웃
            </button>
            <button onClick={() => navigate("/onboarding")} className="px-6 py-3"
                style={{ background: "black", borderRadius: 2, color: "white", fontSize: 14, fontWeight: 400 }}>
                정보수정
            </button>
        </div>

        {/* 모바일 햄버거 */}
        <button className="flex md:hidden flex-col justify-center gap-1.5 p-2"
          onClick={() => setMenuOpen(v => !v)} aria-label="메뉴">
          <span className="block w-5 h-0.5 bg-black" />
          <span className="block w-5 h-0.5 bg-black" />
          <span className="block w-5 h-0.5 bg-black" />
        </button>
      </div>

      {/* 모바일 드롭다운 */}
      {menuOpen && (
        <div className="md:hidden flex flex-col" style={{ background: "#FBF9F9", borderTop: "1px solid #DBDAD9" }}>
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <button key={item.label}
                onClick={() => { navigate(item.path); setMenuOpen(false); }}
                className="flex items-center px-6 py-4 text-left"
                style={{ borderBottom: "1px solid #DBDAD9", color: isActive ? "black" : "#5D5F5F", fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: isActive ? 900 : 600 }}>
                {item.label}
              </button>
            );
          })}
          <button onClick={() => { navigate("/onboarding"); setMenuOpen(false); }}
            className="flex items-center px-6 py-4"
            style={{ borderBottom: "1px solid #DBDAD9", color: "black", fontSize: 14 }}>
            정보수정
          </button>
          <button onClick={handleLogout} className="flex items-center px-6 py-4"
            style={{ color: "#5D5F5F", fontSize: 14 }}>
            로그아웃
          </button>
        </div>
      )}
    </header>
  );
};