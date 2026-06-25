import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { AppHeader } from "../components/AppHeader";
import { authFetch } from "../auth";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5001";

const fields = [
    { key: "title", label: "제목", rows: 1 },
    { key: "role", label: "역할", rows: 1 },
    { key: "background", label: "배경", rows: 3 },
    { key: "action", label: "액션", rows: 3 },
    { key: "result", label: "결과", rows: 3 },
    { key: "learned", label: "배운 점", rows: 3 },
    { key: "reflection", label: "느낀 점", rows: 3 },
    { key: "memo", label: "기타 메모", rows: 2 },
];

export const ExperienceEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const from = location.state?.from || "experiences";
    const [form, setForm] = useState({
        title: "", role: "", background: "", action: "", result: "",
        learned: "", reflection: "", memo: "", start_date: "", end_date: "",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await authFetch(`${BACKEND_URL}/experiences/${id}`);
                if (res.status === 401) { navigate("/login"); return; }
                const data = await res.json();
                const exp = data.experience;
                setForm({
                    title: exp.title || "",
                    role: exp.role || "",
                    background: exp.background || "",
                    action: exp.action || "",
                    result: exp.result || "",
                    learned: exp.learned || "",
                    reflection: exp.reflection || "",
                    memo: exp.memo || "",
                    start_date: exp.start_date || "",
                    end_date: exp.end_date || "",
                });
            } catch {
                navigate("/dashboard");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        document.querySelectorAll("textarea").forEach((el) => {
            el.style.height = "auto";
            el.style.height = el.scrollHeight + "px";
        });
    }, [loading]);

    const handleChange = (key, value) => setForm((f) => ({ ...f, [key]: value }));

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await authFetch(`${BACKEND_URL}/experiences/${id}/edit`, {
                method: "POST",
                body: JSON.stringify(form),
            });
            if (res.ok) navigate(`/experiences/${id}`, { state: { from } });
        } catch (e) {
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="w-full min-h-screen flex items-center justify-center">
            <p style={{ color: "#5D5F5F", fontSize: 14 }}>불러오는 중이에요...</p>
        </div>
    );

    return (
        <div className="w-full min-h-screen flex flex-col items-center" style={{ background: "#FBF9F9", paddingBottom: 64 }}>
            <div className="w-full flex-shrink-0" style={{ background: "#FBF9F9", borderBottom: "1px solid black" }}>
                <div className="w-full mx-auto flex items-center justify-between px-4 md:px-16"
                    style={{ maxWidth: 1280, paddingTop: 20, paddingBottom: 20 }}>
                    <button
                        onClick={() => navigate(`/experiences/${id}`, { state: { from } })}
                        className="flex items-center gap-3 hover:opacity-70 transition-opacity">
                        <span style={{ color: "black", fontSize: 14 }}>←</span>
                        <span style={{ color: "black", fontSize: 20, fontWeight: 400 }}>경험 수정하기</span>
                    </button>
                </div>
            </div>

            <div className="flex flex-col w-full px-4 md:px-0" style={{ maxWidth: 640, paddingTop: 24, gap: 28 }}>

                {/* 날짜 필드 */}
                <div className="flex flex-col" style={{ gap: 6 }}>
                    <label style={{ color: "black", fontSize: 14, fontWeight: 600, letterSpacing: 0.70 }}>
                        활동 기간
                    </label>
                    <div className="flex items-center gap-3">
                        <input
                            type="month"
                            value={form.start_date}
                            onChange={(e) => handleChange("start_date", e.target.value)}
                            style={{ flex: 1, borderBottom: "1px solid #6B7280", padding: "8px", fontSize: 14, color: "#1B1C1C", background: "transparent", outline: "none" }}
                        />
                        <span style={{ color: "#5D5F5F", fontSize: 13 }}>~</span>
                        <input
                            type="month"
                            value={form.end_date}
                            onChange={(e) => handleChange("end_date", e.target.value)}
                            style={{ flex: 1, borderBottom: "1px solid #6B7280", padding: "8px", fontSize: 14, color: "#1B1C1C", background: "transparent", outline: "none" }}
                        />
                    </div>
                    <p style={{ fontSize: 11, color: "#C6C6C7", marginTop: 2 }}>진행 중인 활동이라면 종료일을 비워도 돼요.</p>
                </div>

                {fields.map((field) => (
                    <div key={field.key} className="flex flex-col" style={{ gap: 6 }}>
                        <label style={{ color: "black", fontSize: 14, fontWeight: 600, letterSpacing: 0.70 }}>
                            {field.label}
                        </label>
                        <textarea
                            rows={field.rows}
                            value={form[field.key]}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            className="w-full resize-none bg-transparent outline-none"
                            style={{ borderBottom: "1px solid black", paddingBottom: 8, paddingTop: 4, fontSize: 14, color: "#1B1C1C", lineHeight: "22px", paddingLeft: 8, paddingRight: 8 }}
                            onInput={(e) => { e.target.style.height = "auto"; e.target.style.height = e.target.scrollHeight + "px"; }}
                        />
                    </div>
                ))}

                <button onClick={handleSave} disabled={saving}
                    className="w-full hover:opacity-80 transition-opacity disabled:opacity-50"
                    style={{ background: "black", padding: "14px 24px", color: "white", fontSize: 14, fontWeight: 400 }}>
                    {saving ? "저장 중이에요..." : "수정 완료"}
                </button>
            </div>
        </div>
    );
};