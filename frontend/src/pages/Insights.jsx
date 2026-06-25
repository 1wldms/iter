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
    return Object.entries(count).sort((a, b) => b[1] - a[1]).slice(0, 10);
}

function WordCloud({ keywords }) {
    if (keywords.length === 0) return (
        <p style={{ fontSize: 14, color: "#C6C6C7" }}>키워드가 아직 없어요. AI 세션을 통해 경험을 정리해보세요.</p>
    );
    const maxCount = keywords[0][1];
    const positions = [
        { top: "10%", left: "30%" }, { top: "8%",  left: "58%" },
        { top: "28%", left: "8%" },  { top: "32%", left: "42%" },
        { top: "30%", left: "70%" }, { top: "55%", left: "18%" },
        { top: "58%", left: "50%" }, { top: "55%", left: "76%" },
        { top: "76%", left: "30%" }, { top: "74%", left: "62%" },
    ];
    const rotations = [0, -8, 5, -3, 7, -6, 2, -4, 6, -2];
    return (
        <div style={{ position: "relative", width: "100%", height: 280 }}>
            {keywords.map(([kw, count], i) => {
                const color = KEYWORD_COLORS[i % KEYWORD_COLORS.length];
                const ratio = count / maxCount;
                const fontSize = 13 + Math.round(ratio * 14);
                const fontWeight = ratio === 1 ? 700 : ratio > 0.6 ? 600 : 400;
                const pos = positions[i] || { top: `${10 + i * 8}%`, left: `${10 + i * 7}%` };
                return (
                    <span key={kw} style={{
                        position: "absolute", top: pos.top, left: pos.left,
                        transform: `rotate(${rotations[i] || 0}deg)`,
                        background: color.bg, color: color.text,
                        fontSize, fontWeight, padding: "6px 16px",
                        borderRadius: 20, whiteSpace: "nowrap", userSelect: "none",
                    }}>#{kw}</span>
                );
            })}
        </div>
    );
}

export const Insights = () => {
    const navigate = useNavigate();
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [strength, setStrength] = useState(() => sessionStorage.getItem('insight_strength') || null);
    const [strengthKeywords, setStrengthKeywords] = useState(() => {
        const saved = sessionStorage.getItem('insight_keywords');
        return saved ? JSON.parse(saved) : [];
    });
    const [strengthLoading, setStrengthLoading] = useState(false);
    const [compressedBio, setCompressedBio] = useState(null);
    const [compressLoading, setCompressLoading] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [saving, setSaving] = useState(false);

    const analyzeStrength = async () => {
        setStrengthLoading(true);
        setStrength(null);
        setStrengthKeywords([]);
        setCompressedBio(null);
        setSaveSuccess(false);
        try {
            const res = await authFetch(`${BACKEND_URL}/insights/strengths`, { method: "POST" });
            const data = await res.json();
            const s = data.strength || "분석 결과를 가져오지 못했어요.";
            const k = data.keywords || [];
            setStrength(s);
            setStrengthKeywords(k);
            sessionStorage.setItem('insight_strength', s);
            sessionStorage.setItem('insight_keywords', JSON.stringify(k));
        } catch {
            setStrength("분석 중 오류가 발생했어요. 다시 시도해주세요.");
        } finally {
            setStrengthLoading(false);
        }
    };

    const handleCompress = async () => {
        setCompressLoading(true);
        try {
            const res = await authFetch(`${BACKEND_URL}/insights/compress`, {
                method: "POST",
                body: JSON.stringify({ strength }),
            });
            const data = await res.json();
            setCompressedBio(data.compressed || "");
        } catch {
            setCompressedBio("");
        } finally {
            setCompressLoading(false);
        }
    };

    const handleSaveToBio = async () => {
        if (!compressedBio?.trim()) return;
        setSaving(true);
        try {
            const res = await authFetch(`${BACKEND_URL}/bio-candidates/add`, {
                method: "POST",
                body: JSON.stringify({ content: compressedBio }),
            });
            if (res.ok) setSaveSuccess(true);
        } catch {
            alert("저장에 실패했어요.");
        } finally {
            setSaving(false);
        }
    };

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

    useEffect(() => {
        if (!loading && experiences.length > 0 && !strength) {
            analyzeStrength();
        }
    }, [loading]);

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
            <main className="w-full mx-auto flex flex-col px-4 md:px-16"
                style={{ maxWidth: 1080, paddingTop: 48, paddingBottom: 80, gap: 32 }}>

                <div>
                    <h1 style={{ fontSize: 28, fontWeight: 400, color: "black" }}>Insights</h1>
                    <p style={{ fontSize: 14, color: "#5D5F5F", marginTop: 8 }}>
                        경험이 쌓이면 여기서 나의 패턴을 발견할 수 있어요.
                    </p>
                </div>

                <div style={{ background: "white", outline: "1px solid black", outlineOffset: -1, padding: 32 }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: "#5D5F5F", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>
                        Insights에서 할 수 있는 것들
                    </p>
                    {/* 제목 추가 */}
                    <h2 style={{ fontSize: 22, fontWeight: 400, color: "black", marginBottom: 8, lineHeight: "32px" }}>
                        경험이 쌓이면, 나의 패턴이 보여요
                    </h2>
                    <div style={{ width: 32, height: 1, background: "black", marginBottom: 24 }} />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ marginBottom: 32 }}>
                        {[
                            { icon: "☁️", title: "키워드 클라우드", desc: "경험마다 AI가 추출한 키워드를 모아서 내가 자주 쓰는 역량과 강점이 무엇인지 한눈에 보여줘요. 경험이 많을수록 더 선명해져요." },
                            { icon: "📅", title: "경험 타임라인", desc: "경험들을 시간 순으로 정렬해서 나의 성장 흐름을 시각화해요. 활동 기간을 입력하면 더 정확한 타임라인을 볼 수 있어요." },
                            { icon: "✨", title: "AI 강점 분석", desc: "배운 점과 느낀 점을 바탕으로 AI가 나의 핵심 강점을 2~3문장으로 분석해줘요. 한줄로 압축해서 Card 소개로 저장할 수 있어요." },
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col gap-3" style={{ padding: 20, background: "#FBF9F9", outline: "1px solid #E2E2E2", outlineOffset: -1 }}>
                                <span style={{ fontSize: 20 }}>{item.icon}</span>
                                <p style={{ fontSize: 14, fontWeight: 500, color: "black" }}>{item.title}</p>
                                <p style={{ fontSize: 12, color: "#5D5F5F", lineHeight: "20px" }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => navigate("/experiences/add")}
                            style={{ background: "black", color: "white", padding: "12px 24px", fontSize: 14 }}>
                            첫 경험 기록하기 →
                        </button>
                        <button onClick={() => navigate("/guide")}
                            style={{ outline: "1px solid black", outlineOffset: -1, color: "black", padding: "12px 24px", fontSize: 14 }}>
                            자세한 사용법 보기
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );

    return (
        <div className="w-full min-h-screen flex flex-col" style={{ background: "#FBF9F9" }}>
            <AppHeader />

            <main className="w-full mx-auto flex flex-col px-4 md:px-16"
                style={{ maxWidth: 1080, paddingTop: 32, paddingBottom: 80, gap: 28 }}>

                {/* 헤더 */}
                <div>
                    <h1 style={{ fontSize: 36, fontWeight: 400, color: "black" }}>Insights</h1>
                    <p style={{ fontSize: 16, color: "#5D5F5F", marginTop: 4 }}>
                        {experiences.length}개의 경험에서 발견한 나의 패턴
                    </p>
                </div>

                {/* 1. 키워드 워드클라우드 */}
                <section>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#5D5F5F", letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>
                        자주 등장한 키워드
                    </p>
                    <WordCloud keywords={keywords} />
                </section>

                <div style={{ borderTop: "1px solid #E2E2E2" }} />

                {/* 2. 경험 타임라인 */}
                <section>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#5D5F5F", letterSpacing: 1, textTransform: "uppercase", marginBottom: 24 }}>
                        경험 타임라인
                    </p>
                    <div className="flex flex-col">
                        {timeline.map((exp, i) => (
                            <div key={exp.id} className="flex gap-4">
                                <div style={{ minWidth: 88, textAlign: "right", paddingTop: 2 }}>
                                    <span style={{ fontSize: 12, color: "#5D5F5F", display: "block" }}>
                                        {exp.start_date
                                            ? new Date(exp.start_date).toLocaleDateString("ko-KR", { year: "2-digit", month: "short" })
                                            : new Date(exp.created_at).toLocaleDateString("ko-KR", { year: "2-digit", month: "short" })
                                        }
                                    </span>
                                    {exp.end_date && (
                                        <span style={{ fontSize: 11, color: "#C6C6C7", display: "block" }}>
                                            ~ {new Date(exp.end_date).toLocaleDateString("ko-KR", { year: "2-digit", month: "short" })}
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-col items-center" style={{ width: 20 }}>
                                    <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#1B1C1C", flexShrink: 0, marginTop: 4 }} />
                                    {i < timeline.length - 1 && (
                                        <div style={{ width: 1, flex: 1, background: "#DBDAD9", minHeight: 36 }} />
                                    )}
                                </div>
                                <div className="flex flex-col" style={{ paddingBottom: 32, gap: 3 }}>
                                    <button
                                        onClick={() => navigate(`/experiences/${exp.id}`, { state: { from: "experiences" } })}
                                        className="text-left hover:opacity-60 transition-opacity"
                                        style={{ fontSize: 15, fontWeight: 500, color: "black" }}>
                                        {exp.title || exp.role || "제목 없음"}
                                    </button>
                                    {exp.role && <span style={{ fontSize: 13, color: "#5D5F5F" }}>{exp.role}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <div style={{ borderTop: "1px solid #E2E2E2" }} />

                {/* 3. AI 강점 분석 */}
                <section>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#5D5F5F", letterSpacing: 1, textTransform: "uppercase", marginBottom: 20 }}>
                        AI 강점 분석
                    </p>

                    {strengthLoading && (
                        <div className="flex items-center gap-3">
                            <div style={{ width: 16, height: 16, border: "2px solid #1B1C1C", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                            <p style={{ fontSize: 14, color: "#5D5F5F" }}>경험들을 분석하는 중이에요...</p>
                        </div>
                    )}

                    {strength && !strengthLoading && (
                        <div className="flex flex-col gap-4">
                            <div style={{ background: "white", outline: "1px solid black", outlineOffset: -1, padding: 28 }}>
                                <p style={{ fontSize: 15, color: "#1B1C1C", lineHeight: "26px" }}>{strength}</p>
                                {strengthKeywords.length > 0 && (
                                    <div className="flex gap-2 flex-wrap" style={{ marginTop: 16 }}>
                                        {strengthKeywords.map((kw, i) => (
                                            <span key={i} style={{
                                                background: KEYWORD_COLORS[i % KEYWORD_COLORS.length].bg,
                                                color: KEYWORD_COLORS[i % KEYWORD_COLORS.length].text,
                                                fontSize: 13, padding: "4px 12px", borderRadius: 12,
                                            }}>{kw}</span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {!compressedBio && !compressLoading && (
                                <button type="button" onClick={handleCompress}
                                    style={{ alignSelf: "flex-start", outline: "1px solid black", outlineOffset: -1, background: "white", color: "black", fontSize: 14, padding: "10px 20px" }}>
                                    한줄로 압축하기 →
                                </button>
                            )}

                            {compressLoading && (
                                <div className="flex items-center gap-2">
                                    <div style={{ width: 14, height: 14, border: "2px solid #1B1C1C", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                                    <p style={{ fontSize: 14, color: "#5D5F5F" }}>한줄로 압축하는 중이에요...</p>
                                </div>
                            )}

                            {compressedBio !== null && !compressLoading && (
                                <div className="flex flex-col gap-2">
                                    <p style={{ fontSize: 11, fontWeight: 600, color: "#5D5F5F", letterSpacing: 1, textTransform: "uppercase" }}>
                                        한줄 소개 후보
                                    </p>
                                    <textarea
                                        value={compressedBio}
                                        onChange={(e) => setCompressedBio(e.target.value)}
                                        className="w-full outline-none resize-none"
                                        style={{ border: "1px solid black", padding: 14, fontSize: 14, color: "#1B1C1C", lineHeight: "24px", background: "white" }}
                                        rows={2}
                                    />
                                    <p style={{ fontSize: 12, color: "#C6C6C7" }}>직접 수정할 수 있어요</p>
                                    <div className="flex items-center gap-3">
                                        {saveSuccess ? (
                                            <span style={{ fontSize: 13, color: "#638866" }}>✓ 정보수정 페이지에서 확인하고 선택할 수 있어요</span>
                                        ) : (
                                            <button type="button" onClick={handleSaveToBio} disabled={saving}
                                                style={{ fontSize: 13, padding: "8px 16px", background: "black", color: "white", opacity: saving ? 0.5 : 1 }}>
                                                {saving ? "저장 중..." : "후보로 저장하기"}
                                            </button>
                                        )}
                                        <button type="button" onClick={() => { setCompressedBio(null); setSaveSuccess(false); }}
                                            style={{ fontSize: 13, color: "#5D5F5F", textDecoration: "underline" }}>
                                            다시 압축하기
                                        </button>
                                    </div>
                                </div>
                            )}

                            <button type="button" onClick={analyzeStrength}
                                style={{ alignSelf: "flex-start", fontSize: 13, color: "#5D5F5F", textDecoration: "underline" }}>
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