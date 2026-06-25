import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "../components/AppHeader";

const guides = {
    archive: {
        label: "Archive",
        tagline: "경험을 기록하는 공간",
        intro: "Archive는 당신의 모든 경험을 체계적으로 쌓아가는 곳이에요. 단순한 메모가 아니라, 면접과 자소서에서 바로 꺼내 쓸 수 있는 구조화된 포트폴리오예요.",
        sections: [
            {
                title: "경험 카드 구조",
                desc: "각 경험은 아래 항목으로 구성돼요. 모두 채우지 않아도 괜찮아요. 기억이 생생할 때 조금씩 채워가도 돼요.",
                items: [
                    { label: "역할", desc: "이 경험에서 내가 맡은 포지션. ex) 기획팀장, 개발자, 마케터" },
                    { label: "배경", desc: "왜 이 활동을 시작했는지, 당시 상황과 맥락" },
                    { label: "액션", desc: "목표를 위해 구체적으로 내가 한 행동들" },
                    { label: "결과", desc: "어떤 성과를 얻었는지. 수치가 있으면 더 좋아요" },
                    { label: "배운 점", desc: "이 경험을 통해 새롭게 알게 된 것" },
                    { label: "느낀 점", desc: "힘들었던 점, 뿌듯했던 점 등 솔직한 감정" },
                    { label: "활동 기간", desc: "언제 시작해서 언제 끝났는지. 타임라인에 활용돼요" },
                ],
            },
            {
                title: "AI와 함께 기록하기",
                desc: "경험 저장 후 'AI와 함께 수정하기'를 누르면 AI가 각 항목에 대해 깊이 있는 질문을 해줘요. 대화하듯 답하다 보면 미처 생각 못했던 내용까지 끌어낼 수 있어요. AI는 대신 써주는 게 아니라, 당신이 더 잘 표현할 수 있도록 도와주는 역할을 해요.",
            },
            {
                title: "폴더로 분류하기",
                desc: "경험이 쌓이면 폴더로 묶어서 관리할 수 있어요. ex) '교내 활동', '인턴', '프로젝트'처럼 상황에 맞게 나눠보세요. 대시보드에서 폴더별로 필터링해서 볼 수 있어요.",
            },
        ],
    },
    insights: {
        label: "Insights",
        tagline: "나의 패턴을 발견하는 공간",
        intro: "Insights는 여러 경험에서 반복되는 패턴을 찾아주는 곳이에요. 경험이 쌓일수록 더 정확해지고, 내가 어떤 사람인지를 데이터로 보여줘요.",
        sections: [
            {
                title: "키워드 클라우드",
                desc: "경험을 저장할 때마다 AI가 핵심 키워드를 자동으로 추출해요. 여러 경험에서 반복되는 키워드일수록 더 크게 표시돼요. '리더십', '기획력', '커뮤니케이션'처럼 나를 대표하는 역량을 한눈에 볼 수 있어요.",
            },
            {
                title: "경험 타임라인",
                desc: "경험들을 시간 순으로 나열해서 나의 성장 흐름을 보여줘요. 경험 기록 시 활동 기간(시작일/종료일)을 입력하면 더 정확한 타임라인이 만들어져요. 각 경험을 클릭하면 상세 페이지로 이동해요.",
            },
            {
                title: "AI 강점 분석",
                desc: "배운 점과 느낀 점을 중심으로 AI가 나의 핵심 강점을 2~3문장으로 분석해줘요. 페이지에 처음 들어오면 자동으로 분석이 시작되고, '다시 분석하기'로 새로운 결과를 받을 수 있어요.",
            },
            {
                title: "한줄 소개로 압축하기",
                desc: "'한줄로 압축하기'를 누르면 AI가 강점 분석 결과를 20자 내외의 임팩트 있는 문장으로 만들어줘요. 직접 수정도 가능하고, '후보로 저장하기'를 누르면 정보수정 페이지에서 관리할 수 있어요.",
            },
        ],
    },
    card: {
        label: "Card",
        tagline: "나를 한 장으로 표현하는 공간",
        intro: "Card는 당신의 포트폴리오가 명함 한 장처럼 정리되는 곳이에요. 이름, 한줄 소개, 스킬, 학교, 연락처가 깔끔하게 정리돼요.",
        sections: [
            {
                title: "한줄 소개 연동",
                desc: "Insights에서 AI 강점 분석 → 한줄로 압축 → 후보로 저장 → 정보수정에서 선택하면 Card에 바로 반영돼요. 경험이 쌓일수록 더 정확한 소개문이 만들어져요.",
            },
            {
                title: "정보 관리",
                desc: "헤더 오른쪽 '정보수정' 버튼에서 이름, 학교, 학과, 스킬, GitHub 링크, 연락처를 수정할 수 있어요. 한줄 소개 후보도 여기서 관리해요.",
            },
            {
                title: "ITER의 목표",
                desc: "Card 페이지는 단순한 프로필이 아니에요. 경험을 쌓고, 패턴을 발견하고, 강점을 정리하는 과정을 통해 만들어진 '나다운 한 장'이에요. 자소서를 쓸 때, 면접을 준비할 때, 스스로를 소개할 때 꺼내 쓸 수 있는 나만의 기록이에요.",
            },
        ],
    },
};

export const Guide = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("archive");
    const guide = guides[activeTab];

    return (
        <div className="w-full min-h-screen flex flex-col" style={{ background: "#FBF9F9" }}>
            <AppHeader />

            <main className="w-full mx-auto flex flex-col px-4 md:px-16"
                style={{ maxWidth: 1080, paddingTop: 48, paddingBottom: 80, gap: 40 }}>

                {/* 헤더 */}
                <div>
                    <p style={{ fontSize: 11, fontWeight: 600, color: "#5D5F5F", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>
                        사용 가이드
                    </p>
                    <h1 style={{ fontSize: 28, fontWeight: 400, color: "black", lineHeight: "40px", marginBottom: 8 }}>
                        ITER는 이렇게 사용해요
                    </h1>
                    <p style={{ fontSize: 14, color: "#5D5F5F", lineHeight: "24px" }}>
                        경험을 기록하고 → 패턴을 발견하고 → 나를 표현하는 3단계 여정이에요.
                    </p>
                </div>

                {/* 탭 */}
                <div className="flex gap-0" style={{ borderBottom: "1px solid #E2E2E2" }}>
                    {Object.entries(guides).map(([key, g]) => (
                        <button key={key} onClick={() => setActiveTab(key)}
                            className="px-6 py-3"
                            style={{
                                fontSize: 14, fontWeight: activeTab === key ? 600 : 400,
                                color: activeTab === key ? "black" : "#5D5F5F",
                                borderBottom: activeTab === key ? "2px solid black" : "2px solid transparent",
                                marginBottom: -1,
                                background: "transparent",
                            }}>
                            {g.label}
                        </button>
                    ))}
                </div>

                {/* 탭 내용 */}
                <div className="flex flex-col" style={{ gap: 32 }}>
                    <div style={{ padding: 28, background: "white", outline: "1px solid black", outlineOffset: -1 }}>
                        <p style={{ fontSize: 11, fontWeight: 600, color: "#5D5F5F", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>
                            {guide.label}
                        </p>
                        <h2 style={{ fontSize: 26, fontWeight: 400, color: "black", marginBottom: 12 }}>
                            {guide.tagline}
                        </h2>
                        <div style={{ width: 32, height: 1, background: "black", marginBottom: 16 }} />
                        <p style={{ fontSize: 14, color: "#5D5F5F", lineHeight: "24px" }}>{guide.intro}</p>
                    </div>

                    {guide.sections.map((section, i) => (
                        <div key={i} style={{ paddingBottom: 32, borderBottom: "1px solid #E2E2E2" }}>
                            <h3 style={{ fontSize: 16, fontWeight: 600, color: "black", marginBottom: 12 }}>
                                {section.title}
                            </h3>
                            <p style={{ fontSize: 14, color: "#5D5F5F", lineHeight: "24px", marginBottom: section.items ? 16 : 0 }}>
                                {section.desc}
                            </p>
                            {section.items && (
                                <div className="flex flex-col" style={{ gap: 8, marginTop: 12 }}>
                                    {section.items.map((item, j) => (
                                        <div key={j} className="flex gap-3" style={{ padding: "10px 14px", background: "#FBF9F9", outline: "1px solid #E2E2E2", outlineOffset: -1 }}>
                                            <span style={{ fontSize: 12, fontWeight: 600, color: "black", minWidth: 60 }}>{item.label}</span>
                                            <span style={{ fontSize: 12, color: "#5D5F5F", lineHeight: "20px" }}>{item.desc}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
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