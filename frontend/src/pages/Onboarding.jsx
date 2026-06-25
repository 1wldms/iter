import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../auth";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5001";

export const Onboarding = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "", school: "", department: "",
        interests: "",
        languages: "", github_url: "", contact: "",
    });
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isEdit, setIsEdit] = useState(false);
    const [candidates, setCandidates] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, candidatesRes] = await Promise.all([
                    authFetch(`${BACKEND_URL}/profile`),
                    authFetch(`${BACKEND_URL}/bio-candidates`),
                ]);
                if (profileRes.ok) {
                    const data = await profileRes.json();
                    if (data.profile) {
                        setIsEdit(true);
                        setForm({
                            name: data.profile?.name || data.user?.name || "",
                            school: data.profile.school || "",
                            department: data.profile.department || "",
                            interests: data.profile.interests || "",
                            languages: (data.profile.languages || []).join(", "),
                            github_url: data.profile.github_url || "",
                            contact: data.profile.contact || "",
                        });
                    }
                }
                if (candidatesRes.ok) {
                    const data = await candidatesRes.json();
                    setCandidates(data.candidates || []);
                }
            } catch {}
            finally { setLoading(false); }
        };
        fetchData();
    }, []);

    const handleChange = (key, value) => setForm((f) => ({ ...f, [key]: value }));

    const handleSave = async () => {
        if (!form.name.trim()) { setError("이름은 꼭 입력해주세요!"); return; }
        setSaving(true); setError("");
        try {
            // 현재 선택된 후보의 content를 bio_sentence로 함께 저장
            const selectedCandidate = candidates.find((c) => c.is_selected);
            const res = await authFetch(`${BACKEND_URL}/profile/save`, {
                method: "POST",
                body: JSON.stringify({
                    ...form,
                    languages: form.languages.split(",").map((l) => l.trim()).filter(Boolean),
                    bio_sentence: selectedCandidate?.content || "",
                }),
            });
            if (res.ok) navigate("/profile");
            else setError("저장에 실패했어요. 다시 시도해주세요.");
        } catch {
            setError("서버에 연결할 수 없어요.");
        } finally { setSaving(false); }
    };

    const handleSelect = async (id) => {
        try {
            const res = await authFetch(`${BACKEND_URL}/bio-candidates/${id}/select`, { method: "POST" });
            if (res.ok) {
                setCandidates((prev) => prev.map((c) => ({ ...c, is_selected: c.id === id })));
            }
        } catch { alert("선택에 실패했어요."); }
    };

    const handleDelete = async (id) => {
        try {
            const res = await authFetch(`${BACKEND_URL}/bio-candidates/${id}/delete`, { method: "POST" });
            if (res.ok) setCandidates((prev) => prev.filter((c) => c.id !== id));
        } catch { alert("삭제에 실패했어요."); }
    };

    const handleEditSave = async (id) => {
        if (!editingText.trim()) return;
        try {
            const res = await authFetch(`${BACKEND_URL}/bio-candidates/${id}/edit`, {
                method: "POST",
                body: JSON.stringify({ content: editingText }),
            });
            if (res.ok) {
                setCandidates((prev) => prev.map((c) => c.id === id ? { ...c, content: editingText } : c));
                setEditingId(null);
                setEditingText("");
            }
        } catch { alert("수정에 실패했어요."); }
    };

    const fields = [
        { key: "name", label: "이름", placeholder: "최대 6자", required: true },
        { key: "school", label: "학교", placeholder: "ex. 연세대학교" },
        { key: "department", label: "학과", placeholder: "ex. 컴퓨터공학부" },
        { key: "interests", label: "관심 분야", placeholder: "ex. 마케팅, 전략기획, 스타트업" },
        { key: "languages", label: "기술 스택 / 사용 언어", placeholder: "ex. Python, Figma, JavaScript (쉼표로 구분)" },
        { key: "github_url", label: "GitHub / 포트폴리오 링크", placeholder: "ex. github.com/username" },
        { key: "contact", label: "연락처", placeholder: "ex. hello@email.com" },
    ];

    if (loading) return (
        <div className="w-full min-h-screen flex items-center justify-center" style={{ background: "#FBF9F9" }}>
            <p style={{ color: "#5D5F5F", fontSize: 14 }}>불러오는 중이에요...</p>
        </div>
    );

    return (
        <div className="w-full min-h-screen flex flex-col items-center" style={{ background: "#FBF9F9" }}>
            <div className="w-full flex flex-col px-4 md:px-8" style={{ maxWidth: 560, paddingTop: 40, paddingBottom: 64 }}>

                <span style={{ fontSize: 24, fontFamily: "'Playfair Display', serif", fontWeight: 700, marginBottom: 24 }}>
                    ITER
                </span>

                <h1 style={{ fontSize: 26, fontWeight: 400, lineHeight: "36px", marginBottom: 4 }}>
                    {isEdit ? "정보 수정" : "안녕하세요! 👋"}
                </h1>
                <p style={{ color: "#5D5F5F", fontSize: 13, lineHeight: "20px", marginBottom: 24 }}>
                    {isEdit ? "내 정보를 수정할 수 있어요." : <>먼저 나를 소개하는 정보를 채워볼게요.<br />나중에 언제든지 수정할 수 있어요.</>}
                </p>

                {/* 기본 정보 필드 */}
                <div className="flex flex-col" style={{ gap: 20 }}>
                    {fields.map((field) => (
                        <div key={field.key} className="flex flex-col" style={{ gap: 4 }}>
                            <label style={{ fontSize: 12, color: "#5D5F5F", letterSpacing: 1 }}>
                                {field.label}
                                {field.required && <span style={{ color: "black", marginLeft: 4 }}>*</span>}
                            </label>
                            <input
                                type="text"
                                value={form[field.key]}
                                onChange={(e) => handleChange(field.key, e.target.value)}
                                placeholder={field.placeholder}
                                style={{ borderBottom: "1px solid black", paddingBottom: 8, paddingTop: 4, fontSize: 14, color: "#1B1C1C", background: "transparent", outline: "none", width: "100%" }}
                            />
                        </div>
                    ))}
                </div>

                {error && <p style={{ color: "red", fontSize: 13, marginTop: 12 }}>{error}</p>}

                {/* 한줄 소개 후보 관리 (정보수정 모드에서만) */}
                {isEdit && (
                    <div style={{ marginTop: 48, borderTop: "1px solid #E2E2E2", paddingTop: 32 }}>
                        <p style={{ fontSize: 11, fontWeight: 600, color: "#5D5F5F", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>
                            한줄 소개 후보
                        </p>
                        <p style={{ fontSize: 12, color: "#C6C6C7", marginBottom: 20 }}>
                            Insights에서 저장한 강점 분석 결과예요. 선택하면 Card에 표시돼요.
                        </p>

                        {candidates.length === 0 ? (
                            <p style={{ fontSize: 13, color: "#C6C6C7" }}>
                                아직 저장된 후보가 없어요. Insights에서 강점 분석을 해보세요!
                            </p>
                        ) : (
                            <div className="flex flex-col" style={{ gap: 10 }}>
                                {candidates.map((c) => (
                                    <div key={c.id} style={{
                                        padding: 16,
                                        background: c.is_selected ? "white" : "#F5F3F3",
                                        outline: c.is_selected ? "1.5px solid black" : "1px solid #E2E2E2",
                                        outlineOffset: -1,
                                        display: "flex", flexDirection: "column", gap: 10,
                                    }}>
                                        {editingId === c.id ? (
                                            <div className="flex flex-col gap-2">
                                                <textarea
                                                    value={editingText}
                                                    onChange={(e) => setEditingText(e.target.value)}
                                                    className="w-full outline-none resize-none"
                                                    style={{ fontSize: 13, color: "#1B1C1C", lineHeight: "22px", background: "transparent", borderBottom: "1px solid black", paddingBottom: 6 }}
                                                    rows={3}
                                                />
                                                <div className="flex gap-2">
                                                    <button type="button" onClick={() => handleEditSave(c.id)}
                                                        style={{ fontSize: 12, background: "black", color: "white", padding: "4px 12px" }}>
                                                        저장
                                                    </button>
                                                    <button type="button" onClick={() => { setEditingId(null); setEditingText(""); }}
                                                        style={{ fontSize: 12, color: "#5D5F5F" }}>
                                                        취소
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <p style={{ fontSize: 13, color: "#1B1C1C", lineHeight: "22px" }}>{c.content}</p>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex gap-3">
                                                        <button type="button"
                                                            onClick={() => handleSelect(c.id)}
                                                            style={{
                                                                fontSize: 11, padding: "3px 10px",
                                                                background: c.is_selected ? "black" : "white",
                                                                color: c.is_selected ? "white" : "black",
                                                                outline: "1px solid black", outlineOffset: -1,
                                                            }}>
                                                            {c.is_selected ? "✓ 선택됨" : "선택하기"}
                                                        </button>
                                                        <button type="button"
                                                            onClick={() => { setEditingId(c.id); setEditingText(c.content); }}
                                                            style={{ fontSize: 11, color: "#5D5F5F", textDecoration: "underline" }}>
                                                            수정
                                                        </button>
                                                    </div>
                                                    <button type="button" onClick={() => handleDelete(c.id)}
                                                        style={{ fontSize: 11, color: "#C6C6C7" }}>
                                                        삭제
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* 수정 완료 버튼 — 하나만 */}
                <div className="flex gap-3" style={{ marginTop: 28 }}>
                    {isEdit && (
                        <button onClick={() => navigate(-1)}
                            style={{ flex: 1, border: "1px solid black", color: "black", padding: "12px 24px", fontSize: 14, background: "transparent" }}>
                            취소
                        </button>
                    )}
                    <button onClick={handleSave} disabled={saving}
                        style={{ flex: 2, background: "black", color: "white", padding: "12px 24px", fontSize: 14, fontWeight: 400, opacity: saving ? 0.5 : 1 }}>
                        {saving ? "저장 중이에요..." : isEdit ? "수정 완료" : "시작할게요 →"}
                    </button>
                </div>

            </div>
        </div>
    );
};