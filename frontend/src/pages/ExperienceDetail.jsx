import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppHeader } from "../components/AppHeader";
import { authFetch } from "../auth";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5001";

const FIELD_LABELS = [
    { key: "role", label: "역할" },
    { key: "background", label: "배경" },
    { key: "action", label: "액션" },
    { key: "result", label: "결과" },
    { key: "learned", label: "배운 점" },
    { key: "reflection", label: "느낀 점" },
    { key: "memo", label: "기타 메모" },
];

export const ExperienceDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [exp, setExp] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
        try {
            const res = await authFetch(`${BACKEND_URL}/experiences/${id}`);
            if (res.status === 401) { navigate("/login"); return; }
            const data = await res.json();
            setExp(data.experience);
        } catch {
            navigate("/dashboard");
        } finally {
            setLoading(false);
        }
        };
        fetch();
    }, [id]);

    if (loading) return (
        <div className="w-full min-h-screen flex items-center justify-center">
        <p style={{ color: "#5D5F5F" }}>불러오는 중이에요...</p>
        </div>
    );

    if (!exp) return null;

    return (
        <div className="w-full min-h-screen flex flex-col" style={{ background: "#FBF9F9" }}>
        <AppHeader />

        <main className="w-full mx-auto flex flex-col"
            style={{ maxWidth: 768, paddingTop: 48, paddingBottom: 96, paddingLeft: 32, paddingRight: 32, gap: 40 }}>

            {/* 상단 */}
            <div className="flex items-center justify-between">
            <button onClick={() => navigate(-1)}
                style={{ color: "#5D5F5F", fontSize: 14 }}>
                ← 돌아가기
            </button>
            <span style={{ color: "#5D5F5F", fontSize: 13 }}>
                {new Date(exp.created_at).toLocaleDateString("ko-KR")}
            </span>
            </div>

            {/* 제목 */}
            <h1 style={{ fontSize: 36, fontWeight: 400, lineHeight: "46px", color: "black" }}>
            {exp.title || exp.role || "경험 기록"}
            </h1>

            {/* 필드들 */}
            <div className="flex flex-col" style={{ gap: 32 }}>
            {FIELD_LABELS.map(({ key, label }) => {
                if (!exp[key]) return null;
                return (
                <div key={key} className="flex flex-col" style={{ gap: 8, paddingBottom: 32, borderBottom: "1px solid #DBDAD9" }}>
                    <p style={{ color: "#5D5F5F", fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
                    {label}
                    </p>
                    <p style={{ color: "#1B1C1C", fontSize: 17, lineHeight: "28px" }}>
                    {exp[key]}
                    </p>
                </div>
                );
            })}
            </div>

            {/* 삭제 버튼 */}
            <button
            onClick={async () => {
                await authFetch(`${BACKEND_URL}/experiences/${id}/delete`, { method: "POST" });
                navigate("/dashboard");
            }}
            style={{ color: "#7E7576", fontSize: 14, textDecoration: "underline", alignSelf: "flex-start" }}
            >
            이 경험 삭제하기
            </button>
        </main>
        </div>
    );
};