import { useNavigate } from "react-router-dom";
import { AppHeader } from "../components/AppHeader";

export const Guide = () => {
    const navigate = useNavigate();

    return (
        <div className="w-full min-h-screen flex flex-col" style={{ background: "#FBF9F9" }}>
            <AppHeader />

            <main className="w-full mx-auto flex flex-col px-4 md:px-16"
                style={{ maxWidth: 1080, paddingTop: 48, paddingBottom: 80, gap: 40 }}>

                <div>
                    <p style={{ fontSize: 11, fontWeight: 600, color: "#5D5F5F", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>
                        How it works
                    </p>
                    <h1 style={{ fontSize: 28, fontWeight: 400, color: "black", lineHeight: "40px" }}>
                        ITER는 이렇게 사용해요
                    </h1>
                </div>

                <div className="flex flex-col" style={{ gap: 48 }}>
                    {[
                        {
                            step: "01", tag: "Archive",
                            title: "경험을 기록해요",
                            desc: "역할, 배경, 액션, 결과까지 구조화된 틀로 경험을 남겨요. AI와 함께 대화하며 채울 수도 있어요. 작은 경험이라도 차곡차곡 쌓이면 훌륭한 포트폴리오가 돼요.",
                        },
                        {
                            step: "02", tag: "Insights",
                            title: "패턴을 발견해요",
                            desc: "여러 경험에서 반복되는 키워드와 역할을 시각화해요. AI가 강점을 분석해서 내가 어떤 사람인지 데이터로 보여줘요. 경험이 쌓일수록 더 정확해져요.",
                        },
                        {
                            step: "03", tag: "Card",
                            title: "나를 한줄로 표현해요",
                            desc: "AI가 경험들을 종합해서 강점을 분석하고 한줄 소개로 압축해줘요. 정보수정 페이지에서 후보 중 하나를 선택하면 Card 페이지에 바로 반영돼요.",
                        },
                    ].map((s, i) => (
                        <div key={i} style={{ display: "flex", gap: 32, alignItems: "flex-start", paddingBottom: 48, borderBottom: "1px solid #E2E2E2" }}>
                            <div style={{ minWidth: 40 }}>
                                <span style={{ fontSize: 11, fontWeight: 700, color: "#C6C6C7", letterSpacing: 2 }}>{s.step}</span>
                            </div>
                            <div className="flex flex-col gap-3 flex-1">
                                <div className="flex items-center gap-3">
                                    <h2 style={{ fontSize: 20, fontWeight: 400, color: "black" }}>{s.title}</h2>
                                    <span style={{ fontSize: 10, color: "#5D5F5F", background: "#F0EEEE", padding: "2px 8px", borderRadius: 10 }}>{s.tag}</span>
                                </div>
                                <div style={{ width: 24, height: 1, background: "black" }} />
                                <p style={{ fontSize: 14, color: "#5D5F5F", lineHeight: "24px" }}>{s.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <button onClick={() => navigate(-1)}
                    style={{ alignSelf: "flex-start", fontSize: 13, color: "#5D5F5F", textDecoration: "underline" }}>
                    ← 돌아가기
                </button>
            </main>
        </div>
    );
};