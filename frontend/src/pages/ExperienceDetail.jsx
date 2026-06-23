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
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
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
        fetchData();
    }, [id]);

    const handleDelete = async () => {
        await authFetch(`${BACKEND_URL}/experiences/${id}/delete`, { method: "POST" });
        navigate("/dashboard");
    };

    if (loading) return (
        <div className="w-full min-h-screen flex items-center justify-center">
            <p style={{ color: "#5D5F5F", fontSize: 14 }}>불러오는 중이에요...</p>
        </div>
    );

    if (!exp) return null;

    return (
        <div className="w-full min-h-screen flex flex-col" style={{ background: "#FBF9F9" }}>
            <AppHeader />

            <main className="w-full mx-auto flex flex-col"
                style={{ maxWidth: 640, paddingTop: 32, paddingBottom: 64, paddingLeft: 32, paddingRight: 32, gap: 24 }}>

                {/* 상단 */}
                <div className="flex items-center justify-between">
                    <button onClick={() => navigate("/experiences")} style={{ color: "#5D5F5F", fontSize: 13 }}>
                        ← 돌아가기
                    </button>
                    <span style={{ color: "#5D5F5F", fontSize: 12 }}>
                        {new Date(exp.created_at).toLocaleDateString("ko-KR")}
                    </span>
                </div>

                {/* 제목 */}
                <h1 style={{ fontSize: 22, fontWeight: 400, lineHeight: "30px", color: "black" }}>
                    {exp.title || exp.role || "경험 기록"}
                </h1>

                {/* 필드들 */}
                <div className="flex flex-col" style={{ gap: 16 }}>
                    {FIELD_LABELS.map(({ key, label }) => {
                        if (!exp[key]) return null;
                        return (
                            <div key={key} className="flex flex-col" style={{ gap: 6, paddingBottom: 16, borderBottom: "1px solid #DBDAD9" }}>
                                <p style={{ color: "#5D5F5F", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
                                    {label}
                                </p>
                                <p style={{ color: "#1B1C1C", fontSize: 14, lineHeight: "22px" }}>
                                    {exp[key]}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* 버튼들 */}
                <div className="flex gap-3 mt-4">
                    <button
                        onClick={() => navigate(`/experiences/${id}/edit`)}
                        style={{ background: "black", color: "white", fontSize: 13, padding: "8px 16px" }}
                    >
                        직접 수정하기
                    </button>
                    <button
                        onClick={() => navigate("/ai-session", { state: { experience: exp } })}
                        style={{ outline: "1px solid black", outlineOffset: -1, color: "black", fontSize: 13, padding: "8px 16px" }}
                    >
                        AI와 함께 수정하기
                    </button>
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        style={{ color: "#7E7576", fontSize: 13, textDecoration: "underline", marginLeft: "auto" }}
                    >
                        이 경험 삭제하기
                    </button>
                </div>
            </main>

            {/* 삭제 확인 모달 */}
            {showDeleteModal && (
                <div className="fixed inset-0 flex items-center justify-center"
                    style={{ background: "rgba(0,0,0,0.4)", zIndex: 50 }}>
                    <div className="flex flex-col"
                        style={{ background: "white", padding: 32, gap: 20, maxWidth: 360, width: "90%", outline: "1px solid black", outlineOffset: -1 }}>
                        <h2 style={{ fontSize: 16, fontWeight: 400, color: "black" }}>경험을 삭제할까요?</h2>
                        <p style={{ fontSize: 13, color: "#5D5F5F", lineHeight: "20px" }}>
                            삭제한 경험은 복구할 수 없어요.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowDeleteModal(false)}
                                style={{ flex: 1, padding: "10px 0", outline: "1px solid black", outlineOffset: -1, fontSize: 13, color: "black" }}>
                                취소
                            </button>
                            <button onClick={handleDelete}
                                style={{ flex: 1, padding: "10px 0", background: "black", color: "white", fontSize: 13 }}>
                                삭제하기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};