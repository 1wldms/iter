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
        .slice(0, 10);
}

function WordCloud({ keywords }) {
    if (keywords.length === 0) return (
        <p style={{ fontSize: 13, color: "#C6C6C7" }}>키워드가 아직 없어요. AI 세션을 통해 경험을 정리해보세요.</p>
    );

    const maxCount = keywords[0][1];
    const positions = [
        { top: "10%", left: "30%" },
        { top: "8%",  left: "58%" },
        { top: "28%", left: "8%" },
        { top: "32%", left: "42%" },
        { top: "30%", left: "70%" },
        { top: "55%", left: "18%" },
        { top: "58%", left: "50%" },
        { top: "55%", left: "76%" },
        { top: "76%", left: "30%" },
        { top: "74%", left: "62%" },
    ];
    const rotations = [0, -8, 5, -3, 7, -6, 2, -4, 6, -2];

    return (
        <div style={{ position: "relative", width: "100%", height: 260 }}>
            {keywords.map(([kw, count], i) => {
                const color = KEYWORD_COLORS[i % KEYWORD_COLORS.length];
                const ratio = count / maxCount;
                const fontSize = 12 + Math.round(ratio * 14);
                const fontWeight = ratio === 1 ? 700 : ratio > 0.6 ? 600 : 400;
                const pos = positions[i] || { top: `${10 + i * 8}%`, left: `${10 + i * 7}%` };
                const rotation = rotations[i] || 0;
                return (
                    <span key={kw} style={{
                        position: "absolute",
                        top: pos.top, left: pos.left,
                        transform: `rotate(${rotation}deg)`,
                        background: color.bg, color: color.text,
                        fontSize, fontWeight,
                        padding: "4px 12px", borderRadius: 20,
                        whiteSpace: "nowrap", userSelect: "none",
                    }}>
                        #{kw}
                    </span>
                );
            })}
        </div>
    );
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
    const timeline = [...experiences].sort((a, b) => {
        const dateA = new Date(a.start_date || a.created_at);
        const dateB = new Date(b.start_date || b.created_at);
        return dateA - dateB;
    });

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

                <div>
                    <h1 style={{ fontSize: 28, fontWeight: 400, color: "black" }}>Insights</h1>
                    <p style={{ fontSize: 13, color: "#5D5F5F", marginTop: 6 }}>
                        {experiences.length}개의 경험에서 발견한 나의 패턴
                    </p>
                </div>

                {/* 1. 키워드 워드클라우드 */}
                <section>
                    <p style={{ fontSize: 11, fontWeight: 600, color: "#5D5F5F", letterSpacing: 1, textTransform: "uppercase", marginBottom: 20 }}>
                        자주 등장한 키워드
                    </p>
                    <WordCloud keywords={keywords} />
                </section>

                <div style={{ borderTop: "1px solid #E2E2E2" }} />

                {/* 2. 경험 타임라인 */}
                <section>
                    <p style={{ fontSize: 11, fontWeight: 600, color: "#5D5F5F", letterSpacing: 1, textTransform: "uppercase", marginBottom: 20 }}>
                        경험 타임라인
                    </p>
                    <div className="flex flex-col">
                        {timeline.map((exp, i) => (
                            <div key={exp.id} className="flex gap-4">
                                {/* 날짜 */}
                                <div style={{ minWidth: 80, textAlign: "right", paddingTop: 2 }}>
                                    <span style={{ fontSize: 11, color: "#5D5F5F", display: "block" }}>
                                        {exp.start_date
                                            ? new Date(exp.start_date).toLocaleDateString("ko-KR", { year: "2-digit", month: "short" })
                                            : new Date(exp.created_at).toLocaleDateString("ko-KR", { year: "2-digit", month: "short" })
                                        }
                                    </span>
                                    {exp.end_date && (
                                        <span style={{ fontSize: 10, color: "#C6C6C7", display: "block" }}>
                                            ~ {new Date(exp.end_date).toLocaleDateString("ko-KR", { year: "2-digit", month: "short" })}
                                        </span>
                                    )}
                                </div>
                                {/* 선 */}
                                <div className="flex flex-col items-center" style={{ width: 20 }}>
                                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1B1C1C", flexShrink: 0, marginTop: 4 }} />
                                    {i < timeline.length - 1 && (
                                        <div style={{ width: 1, flex: 1, background: "#DBDAD9", minHeight: 32 }} />
                                    )}
                                </div>
                                {/* 내용 */}
                                <div className="flex flex-col" style={{ paddingBottom: 28, gap: 2 }}>
                                    <button
                                        onClick={() => navigate(`/experiences/${exp.id}`, { state: { from: "experiences" } })}
                                        className="text-left hover:opacity-60 transition-opacity"
                                        style={{ fontSize: 13, fontWeight: 500, color: "black" }}>
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

                {/* 3. AI 강점 분석 */}
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
                            <div style={{ background: "white", outline: "1px solid black", outlineOffset: -1, padding: 24 }}>
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

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};