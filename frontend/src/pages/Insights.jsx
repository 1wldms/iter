import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "../components/AppHeader";
import { authFetch } from "../auth";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5001";

const KEYWORD_COLORS = [
    { bg: "#FDECEC", text: "#977171" },
    { bg: "#FEF3E2", text: "#857948" },
    { bg: "#cbdfcd", text: "#638866" },
    { bg: "#E3F2FD", text: "#647382" },
    { bg: "#cdfaf5", text: "#566e6b" },
];

function aggregateKeywords(experiences) {
    const count = {};
    experiences.forEach((exp) => {
        (exp.keywords || []).forEach((kw) => {
        count[kw] = (count[kw] || 0) + 1;
        });
    });
    return Object.entries(count)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20);
}

function aggregateRoles(experiences) {
    const count = {};
    experiences.forEach((exp) => {
        if (exp.role) count[exp.role] = (count[exp.role] || 0) + 1;
    });
    return Object.entries(count).sort((a, b) => b[1] - a[1]);
}

export const Insights = () => {
    const navigate = useNavigate();
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [strength, setStrength] = useState(null);
    const [strengthKeywords, setStrengthKeywords] = useState([]);
    const [strengthLoading, setStrengthLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
        try {
            const res = await authFetch(`${BACKEND_URL}/experiences`);
            if (res.status === 401) { navigate("/login"); return; }
            const data = await res.json();
            setExperiences(data.experiences || []);
        } catch {
            console.error("경험 불러오기 실패");
        } finally {
            setLoading(false);
        }
        };
        fetchData();
    }, []);

    const handleAnalyzeStrength = async () => {
        setStrengthLoading(true);
        setStrength(null);
        setStrengthKeywords([]);
        try {
        const res = await authFetch(`${BACKEND_URL}/insights/strengths`, { method: "POST" });
        const data = await res.json();
        setStrength(data.strength || "분석 결과를 가져오지 못했어요.");
        setStrengthKeywords(data.keywords || []);
        } catch {
        setStrength("분석 중 오류가 발생했어요. 다시 시도해주세요.");
        } finally {
        setStrengthLoading(false);
        }
    };

    const keywords = aggregateKeywords(experiences);
    const roles = aggregateRoles(experiences);
    const maxRoleCount = roles[0]?.[1] || 1;
    const timeline = [...experiences].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    if (loading) return (
        <div className="w-full min-h-screen flex flex-col" style={{ background: "#FBF9F9" }}>
        <AppHeader />
        <div className="flex items-center justify-center" style={{ paddingTop: 120 }}>
            <p style={{ color: "#5D5F5F", fontSize: 14 }}>불러오는 중이에요...</p>
        </div>
        </div>
    );

    if (experiences.length === 0) return (
        <div className="w-full min-h-screen flex flex-col" style={{ background: "#FBF9F9" }}>
        <AppHeader />
        <div className="flex flex-col items-center justify-center gap-4" style={{ paddingTop: 120 }}>
            <p style={{ color: "#5D5F5F", fontSize: 15 }}>아직 기록된 경험이 없어요.</p>
            <button onClick={() => navigate("/experiences/add")}
            style={{ background: "black", color: "white", padding: "10px 20px", fontSize: 13 }}>
            첫 경험 기록하기
            </button>
        </div>
        </div>
    );

    return (
        <div className="w-full min-h-screen flex flex-col" style={{ background: "#FBF9F9" }}>
        <AppHeader />

        <main className="w-full mx-auto flex flex-col px-4 md:px-16"
            style={{ maxWidth: 1080, paddingTop: 48, paddingBottom: 80, gap: 48 }}>

            {/* ── 헤더 ── */}
            <div>
            <h1 style={{ fontSize: 28, fontWeight: 400, color: "black", lineHeight: "36px" }}>Insights</h1>
            <p style={{ fontSize: 13, color: "#5D5F5F", marginTop: 6 }}>
                {experiences.length}개의 경험에서 발견한 나의 패턴
            </p>
            </div>

            {/* ── 1. 키워드 태그 클라우드 ── */}
            <section>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#5D5F5F", letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>
                자주 등장한 키워드
            </p>
            {keywords.length === 0 ? (
                <p style={{ fontSize: 13, color: "#C6C6C7" }}>키워드가 아직 없어요. AI 세션을 통해 경험을 정리해보세요.</p>
            ) : (
                <div className="flex flex-wrap gap-2">
                {keywords.map(([kw, count], i) => {
                    const color = KEYWORD_COLORS[i % KEYWORD_COLORS.length];
                    // 빈도에 따라 폰트 크기 조절 (최소 12, 최대 20)
                    const maxCount = keywords[0][1];
                    const fontSize = 12 + Math.round((count / maxCount) * 8);
                    return (
                    <span key={kw} style={{
                        background: color.bg, color: color.text,
                        fontSize, fontWeight: count === maxCount ? 600 : 400,
                        padding: "4px 12px", borderRadius: 20,
                    }}>
                        #{kw}
                        {count > 1 && (
                        <span style={{ fontSize: 10, opacity: 0.7, marginLeft: 4 }}>×{count}</span>
                        )}
                    </span>
                    );
                })}
                </div>
            )}
            </section>

            <div style={{ borderTop: "1px solid #E2E2E2" }} />

            {/* ── 2. 역할 패턴 ── */}
            <section>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#5D5F5F", letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>
                역할 패턴
            </p>
            {roles.length === 0 ? (
                <p style={{ fontSize: 13, color: "#C6C6C7" }}>역할 정보가 없어요.</p>
            ) : (
                <div className="flex flex-col gap-3">
                {roles.map(([role, count]) => (
                    <div key={role} className="flex items-center gap-3">
                    <span style={{ fontSize: 12, color: "#4C4546", minWidth: 160, flexShrink: 0 }}>{role}</span>
                    <div style={{ flex: 1, background: "#F0EEEE", height: 8, borderRadius: 4, overflow: "hidden" }}>
                        <div style={{
                        width: `${(count / maxRoleCount) * 100}%`,
                        height: "100%",
                        background: "#1B1C1C",
                        borderRadius: 4,
                        transition: "width 0.6s ease",
                        }} />
                    </div>
                    <span style={{ fontSize: 11, color: "#5D5F5F", minWidth: 24, textAlign: "right" }}>{count}회</span>
                    </div>
                ))}
                </div>
            )}
            </section>

            <div style={{ borderTop: "1px solid #E2E2E2" }} />

            {/* ── 3. 경험 타임라인 ── */}
            <section>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#5D5F5F", letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>
                경험 타임라인
            </p>
            <div className="flex flex-col" style={{ gap: 0 }}>
                {timeline.map((exp, i) => (
                <div key={exp.id} className="flex gap-4">
                    {/* 왼쪽 날짜 */}
                    <div style={{ minWidth: 80, textAlign: "right", paddingTop: 2 }}>
                    <span style={{ fontSize: 11, color: "#5D5F5F" }}>
                        {new Date(exp.created_at).toLocaleDateString("ko-KR", { year: "2-digit", month: "short" })}
                    </span>
                    </div>

                    {/* 중간 타임라인 선 */}
                    <div className="flex flex-col items-center" style={{ width: 20 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1B1C1C", flexShrink: 0, marginTop: 4 }} />
                    {i < timeline.length - 1 && (
                        <div style={{ width: 1, flex: 1, background: "#DBDAD9", minHeight: 32 }} />
                    )}
                    </div>

                    {/* 오른쪽 내용 */}
                    <div className="flex flex-col" style={{ paddingBottom: 24, gap: 2 }}>
                    <button onClick={() => navigate(`/experiences/${exp.id}`, { state: { from: "experiences" } })}
                        className="text-left hover:opacity-60 transition-opacity"
                        style={{ fontSize: 13, fontWeight: 500, color: "black", lineHeight: "20px" }}>
                        {exp.title || exp.role || "제목 없음"}
                    </button>
                    {exp.role && (
                        <span style={{ fontSize: 11, color: "#5D5F5F" }}>{exp.role}</span>
                    )}
                    </div>
                </div>
                ))}
            </div>
            </section>

            <div style={{ borderTop: "1px solid #E2E2E2" }} />

            {/* ── 4. AI 강점 분석 ── */}
            <section>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#5D5F5F", letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>
                AI 강점 분석
            </p>

            {!strength && !strengthLoading && (
                <div className="flex flex-col gap-3">
                <p style={{ fontSize: 13, color: "#4C4546", lineHeight: "20px" }}>
                    지금까지의 경험을 분석해서 당신의 강점을 한눈에 보여드릴게요.
                </p>
                <button type="button" onClick={handleAnalyzeStrength}
                    style={{ alignSelf: "flex-start", background: "black", color: "white", fontSize: 13, padding: "10px 20px" }}>
                    강점 분석하기
                </button>
                </div>
            )}

            {strengthLoading && (
                <div className="flex items-center gap-3">
                <div style={{ width: 16, height: 16, border: "2px solid #1B1C1C", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                <p style={{ fontSize: 13, color: "#5D5F5F" }}>경험들을 분석하는 중이에요...</p>
                </div>
            )}

            {strength && !strengthLoading && (
                <div className="flex flex-col gap-4">
                <div style={{ background: "white", outline: "1px solid black", outlineOffset: -1, padding: 24, lineHeight: "22px" }}>
                    <p style={{ fontSize: 14, color: "#1B1C1C", lineHeight: "24px" }}>{strength}</p>
                    {strengthKeywords.length > 0 && (
                    <div className="flex gap-2 flex-wrap" style={{ marginTop: 16 }}>
                        {strengthKeywords.map((kw, i) => (
                        <span key={i} style={{
                            background: KEYWORD_COLORS[i % KEYWORD_COLORS.length].bg,
                            color: KEYWORD_COLORS[i % KEYWORD_COLORS.length].text,
                            fontSize: 12, padding: "3px 10px", borderRadius: 12,
                        }}>
                            {kw}
                        </span>
                        ))}
                    </div>
                    )}
                </div>
                <button type="button" onClick={handleAnalyzeStrength}
                    style={{ alignSelf: "flex-start", fontSize: 12, color: "#5D5F5F", textDecoration: "underline" }}>
                    다시 분석하기
                </button>
                </div>
            )}
            </section>
        </main>

        {/* 스피너 CSS */}
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};