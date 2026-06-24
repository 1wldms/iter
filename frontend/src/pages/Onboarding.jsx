import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../auth";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5001";

export const Onboarding = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        school: "",
        department: "",
        languages: "",
        github_url: "",
        contact: "",
    });
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        const fetchExisting = async () => {
        try {
            const res = await authFetch(`${BACKEND_URL}/profile`);
            if (!res.ok) return;
            const data = await res.json();
            if (data.profile) {
            setIsEdit(true);
            setForm({
                name: data.profile?.name || data.user?.name || "",
                school: data.profile.school || "",
                department: data.profile.department || "",
                languages: (data.profile.languages || []).join(", "),
                github_url: data.profile.github_url || "",
                contact: data.profile.contact || "",
            });
            }
        } catch {}
        finally {
            setLoading(false);
        }
        };
        fetchExisting();
    }, []);

    const handleChange = (key, value) => setForm((f) => ({ ...f, [key]: value }));

    const handleSave = async () => {
        if (!form.name.trim()) {
        setError("이름은 꼭 입력해주세요!");
        return;
        }
        setSaving(true);
        setError("");
        try {
        const res = await authFetch(`${BACKEND_URL}/profile/save`, {
            method: "POST",
            body: JSON.stringify({
            ...form,
            languages: form.languages.split(",").map((l) => l.trim()).filter(Boolean),
            }),
        });
        if (res.ok) {
            navigate("/profile");
        } else {
            setError("저장에 실패했어요. 다시 시도해주세요.");
        }
        } catch {
        setError("서버에 연결할 수 없어요.");
        } finally {
        setSaving(false);
        }
    };

    const fields = [
        { key: "name", label: "이름", placeholder: "최대 6자", required: true },
        { key: "school", label: "학교", placeholder: "ex. 연세대학교" },
        { key: "department", label: "학과", placeholder: "ex. 컴퓨터공학부" },
        { key: "languages", label: "사용 언어 / 스킬", placeholder: "ex. Python, Figma, JavaScript (쉼표로 구분)" },
        { key: "github_url", label: "GitHub / 포트폴리오 링크", placeholder: "ex. github.com/username" },
        { key: "contact", label: "연락처", placeholder: "ex. hello@email.com" },
    ];

    if (loading) return (
        <div className="w-full min-h-screen flex items-center justify-center" style={{ background: "#FBF9F9" }}>
        <p style={{ color: "#5D5F5F", fontSize: 14 }}>불러오는 중이에요...</p>
        </div>
    );

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center"
        style={{ background: "#FBF9F9" }}>
        <div className="w-full flex flex-col" style={{ maxWidth: 560, padding: "24px 32px" }}>
            <span style={{ fontSize: 24, fontFamily: "'Playfair Display', serif", fontWeight: 700, marginBottom: 24 }}>
            ITER
            </span>

            <h1 style={{ fontSize: 26, fontWeight: 400, lineHeight: "36px", marginBottom: 4 }}>
            {isEdit ? "정보 수정" : "안녕하세요! 👋"}
            </h1>
            <p style={{ color: "#5D5F5F", fontSize: 13, lineHeight: "20px", marginBottom: 24 }}>
            {isEdit ? "내 정보를 수정할 수 있어요." : "먼저 나를 소개하는 정보를 채워볼게요. 나중에 언제든지 수정할 수 있어요."}
            </p>

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
                    style={{
                    borderBottom: "1px solid black",
                    paddingBottom: 8,
                    paddingTop: 4,
                    fontSize: 14,
                    color: "#1B1C1C",
                    background: "transparent",
                    outline: "none",
                    width: "100%",
                    }}
                />
                </div>
            ))}
            </div>

            {error && <p style={{ color: "red", fontSize: 13, marginTop: 12 }}>{error}</p>}

            <div className="flex gap-3" style={{ marginTop: 28 }}>
            {isEdit && (
                <button
                onClick={() => navigate(-1)}
                style={{
                    flex: 1,
                    border: "1px solid black",
                    color: "black",
                    padding: "12px 24px",
                    fontSize: 14,
                    cursor: "pointer",
                    background: "transparent",
                }}
                >
                취소
                </button>
            )}
            <button
                onClick={handleSave}
                disabled={saving}
                style={{
                flex: 2,
                background: "black",
                color: "white",
                padding: "12px 24px",
                fontSize: 14,
                fontWeight: 400,
                opacity: saving ? 0.5 : 1,
                cursor: saving ? "not-allowed" : "pointer",
                }}
            >
                {saving ? "저장 중이에요..." : isEdit ? "수정 완료" : "시작할게요 →"}
            </button>
            </div>
        </div>
        </div>
    );
};