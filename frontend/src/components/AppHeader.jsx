import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  { label: "Card", path: "/profile" },
  { label: "Insights", path: "/insights" },
  { label: "Archive", path: "/dashboard" },
];

export const AppHeader = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = async () => {
    await fetch(`${import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5001"}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    navigate("/login");
  };

  return (
    <header
      className="w-full flex-shrink-0"
      style={{ background: "#FBF9F9", borderBottom: "1px solid black" }}
    >
      <div
        className="w-full mx-auto flex items-center justify-between"
        style={{ maxWidth: 1280, height: 64, paddingLeft: 64, paddingRight: 64 }}
      >
        {/* 로고 */}
        <button
          onClick={() => navigate("/profile")}
          style={{
            color: "black",
            fontSize: 32,
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700,
            lineHeight: "41.6px",
          }}
        >
          ITER
        </button>

        {/* 네비게이션 */}
        <nav className="flex items-stretch h-full">
          {navItems.map((item, i) => {
            const isActive = pathname === item.path;
            return (
              <div
                key={item.label}
                className="flex items-center"
                style={{ paddingLeft: i === 0 ? 0 : 32 }}
              >
                <button
                  onClick={() => navigate(item.path)}
                  className="flex items-center px-4 h-full"
                  style={isActive ? { borderBottom: "1px solid black" } : {}}
                >
                  <span
                    style={{
                      color: isActive ? "black" : "#5D5F5F",
                      fontSize: 14,
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: isActive ? 900 : 600,
                      lineHeight: "16.8px",
                      letterSpacing: 0.70,
                    }}
                  >
                    {item.label}
                  </span>
                </button>
              </div>
            );
          })}
        </nav>

        {/* 버튼 */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleLogout}
            className="whitespace-nowrap px-6 py-3"
            style={{
              borderRadius: 2,
              outline: "1px solid black",
              outlineOffset: -1,
              color: "black",
              fontSize: 16,
              fontWeight: 400,
              lineHeight: "16px",
            }}
          >
            로그아웃
          </button>
          <button
            onClick={() => navigate("/onboarding")}
            className="px-6 py-3"
            style={{
              background: "black",
              borderRadius: 2,
              color: "white",
              fontSize: 16,
              fontWeight: 400,
              lineHeight: "16px",
            }}
          >
            정보수정
          </button>
        </div>
      </div>
    </header>
  );
};
