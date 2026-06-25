import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "../components/AppHeader";
import { authFetch } from "../auth";

const KEYWORD_COLORS = [
  { bg: "#FDECEC", text: "#977171" },
  { bg: "#FEF3E2", text: "#857948" },
  { bg: "#cbdfcd", text: "#638866" },
  { bg: "#E3F2FD", text: "#647382" },
  { bg: "#cdfaf5", text: "#566e6b" },
];

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5001";

const ExperienceCard = ({ exp, onClick, folders, onMove }) => (
  <div className="hover:shadow-md transition-shadow"
    style={{ padding: 20, background: "white", outline: "1px solid black", outlineOffset: -1, display: "flex", flexDirection: "column", gap: 6, height: 200, overflow: "hidden" }}>

    <div onClick={onClick} className="cursor-pointer flex items-center justify-between">
      <span className="px-2 py-1"
        style={{ borderRadius: 8, outline: "1px solid #7E7576", outlineOffset: -1, color: "#4C4546", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.70 }}>
        {exp.role || "경험"}
      </span>
      <span style={{ color: "#5D5F5F", fontSize: 11, fontWeight: 600, letterSpacing: 0.70 }}>
        {exp.start_date
          ? new Date(exp.start_date).toLocaleDateString("ko-KR", { year: "numeric", month: "long" })
            + (exp.end_date ? " – " + new Date(exp.end_date).toLocaleDateString("ko-KR", { year: "numeric", month: "long" }) : " – 진행 중")
          : "기록일: " + new Date(exp.created_at).toLocaleDateString("ko-KR")
        }
      </span>
    </div>

    <h3 onClick={onClick} className="cursor-pointer" style={{ color: "black", fontSize: 18, fontWeight: 400, lineHeight: "26px", paddingTop: 4, flex: 1 }}>
      {exp.title || exp.role || "제목 없음"}
    </h3>

    <div className="flex items-center justify-between gap-2">
      <div className="flex gap-1 flex-wrap overflow-hidden" style={{ maxHeight: 28 }}>
        {(exp.keywords && exp.keywords.length > 0)
          ? exp.keywords.map((kw, i) => {
              const color = KEYWORD_COLORS[i % KEYWORD_COLORS.length];
              return (
                <span key={i} style={{ background: color.bg, color: color.text, fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 4, whiteSpace: "nowrap" }}>
                  #{kw}
                </span>
              );
            })
          : <p style={{ color: "#C6C6C7", fontSize: 12 }}>키워드가 아직 없어요</p>
        }
      </div>
      <select
        value={exp.folder_id || ""}
        onChange={(e) => onMove(exp.id, e.target.value || null)}
        onClick={(e) => e.stopPropagation()}
        style={{ flexShrink: 0, fontSize: 11, color: "#5D5F5F", border: "1px solid #C6C6C7", borderRadius: 4, background: "white", padding: "2px 4px" }}
      >
        <option value="">미분류</option>
        {folders.map((f) => (
          <option key={f.id} value={f.id}>{f.name}</option>
        ))}
      </select>
    </div>
  </div>
);

export const Dashboard = () => {
  const navigate = useNavigate();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("newest");
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [showFolderInput, setShowFolderInput] = useState(false);

  useEffect(() => {
    const fetchExperiences = async () => {
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
    fetchExperiences();
  }, []);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const res = await authFetch(`${BACKEND_URL}/folders`);
        const data = await res.json();
        setFolders(data.folders || []);
      } catch {
        console.error("폴더 불러오기 실패");
      }
    };
    fetchFolders();
  }, []);

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      const res = await authFetch(`${BACKEND_URL}/folders/add`, {
        method: "POST",
        body: JSON.stringify({ name: newFolderName.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.folder) {
        setFolders((prev) => [...prev, data.folder]);
        setNewFolderName("");
        setShowFolderInput(false);
      } else {
        alert(data.error || "폴더 생성에 실패했어요.");
      }
    } catch (err) {
      console.error(err);
      alert("서버 연결에 실패했어요.");
    }
  };

  const handleMoveToFolder = async (experienceId, folderId) => {
    try {
      const res = await authFetch(`${BACKEND_URL}/experiences/${experienceId}/move`, {
        method: "POST",
        body: JSON.stringify({ folder_id: folderId }),
      });
      if (res.ok) {
        setExperiences((prev) =>
          prev.map((exp) => (exp.id === experienceId ? { ...exp, folder_id: folderId } : exp))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const sortedExperiences = [...experiences].sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  const filteredExperiences = selectedFolder === null
    ? sortedExperiences
    : sortedExperiences.filter((exp) => exp.folder_id === selectedFolder);

  return (
    <div className="w-full min-h-screen flex flex-col" style={{ background: "#FBF9F9" }}>
      <AppHeader />

      <main className="w-full mx-auto flex flex-col px-4 md:px-16"
        style={{ maxWidth: 1280, paddingTop: 40, paddingBottom: 80, gap: 24 }}>

        <div className="flex items-end justify-between">
          <h1 style={{ color: "black", fontSize: 32, fontWeight: 400, lineHeight: "40px" }}>내 경험</h1>
          <div className="flex items-center gap-2 mb-1">
            <button onClick={() => setSortOrder("newest")} className="px-3 py-1"
              style={{ outline: "1px solid black", outlineOffset: -1, background: sortOrder === "newest" ? "#5D5F5F" : "white", color: sortOrder === "newest" ? "white" : "black", fontSize: 13, fontWeight: 400 }}>
              최신순
            </button>
            <button onClick={() => setSortOrder("oldest")} className="px-3 py-1"
              style={{ outline: "1px solid black", outlineOffset: -1, background: sortOrder === "oldest" ? "#5D5F5F" : "white", color: sortOrder === "oldest" ? "white" : "black", fontSize: 13, fontWeight: 400 }}>
              오래된순
            </button>
            <button onClick={() => navigate("/experiences")} className="px-3 py-1"
              style={{ outline: "1px solid black", outlineOffset: -1, background: "black", color: "#ffffff", fontSize: 13, fontWeight: 400 }}>
              모두 보기
            </button>
          </div>
        </div>

        {/* 폴더 영역 — 항상 표시 */}
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setSelectedFolder(null)}
            style={{ height: 30, padding: "0 12px", borderRadius: 16, background: selectedFolder === null ? "black" : "#F5F3F3", color: selectedFolder === null ? "white" : "#4C4546", fontSize: 13, fontWeight: 400, whiteSpace: "nowrap" }}>
            전체
          </button>
          {folders.map((folder) => (
            <button key={folder.id} onClick={() => setSelectedFolder(folder.id)}
              style={{ height: 30, padding: "0 12px", borderRadius: 16, background: selectedFolder === folder.id ? "black" : "#F5F3F3", color: selectedFolder === folder.id ? "white" : "#4C4546", fontSize: 13, fontWeight: 400, whiteSpace: "nowrap" }}>
              {folder.name}
            </button>
          ))}
          {showFolderInput ? (
            <div className="flex items-center gap-1">
              <input
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.nativeEvent.isComposing) { e.preventDefault(); handleCreateFolder(); }
                  if (e.key === "Escape") { setShowFolderInput(false); setNewFolderName(""); }
                }}
                placeholder="폴더 이름"
                autoFocus
                className="px-2 outline-none"
                style={{ border: "1px solid #C6C6C7", borderRadius: 16, fontSize: 13, width: 120, height: 30 }}
              />
              <button type="button" onClick={handleCreateFolder}
                style={{ height: 30, padding: "0 10px", background: "black", color: "white", borderRadius: 16, fontSize: 13 }}>
                추가
              </button>
              <button type="button" onClick={() => { setShowFolderInput(false); setNewFolderName(""); }}
                style={{ height: 30, padding: "0 8px", color: "#5D5F5F", fontSize: 13 }}>
                취소
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => setShowFolderInput(true)}
              style={{ height: 30, padding: "0 12px", borderRadius: 16, outline: "1px dashed #C6C6C7", outlineOffset: -1, color: "#5D5F5F", fontSize: 13 }}>
              + 새 폴더
            </button>
          )}
        </div>

        {loading ? (
          <p style={{ color: "#5D5F5F", fontSize: 14 }}>불러오는 중이에요...</p>
        ) : experiences.length === 0 ? (
          <div className="flex flex-col" style={{ gap: 0 }}>
            {/* 가이드 배너 */}
            <div style={{ background: "white", outline: "1px solid black", outlineOffset: -1, padding: 32, marginBottom: 16 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: "#5D5F5F", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>
                How it works
              </p>
              <h2 style={{ fontSize: 22, fontWeight: 400, color: "black", marginBottom: 8, lineHeight: "32px" }}>
                  ITER는 이렇게 사용해요
              </h2>
              <div style={{ width: 32, height: 1, background: "black", marginBottom: 24 }} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ marginBottom: 28 }}>
                {[
                  { step: "01", tag: "Archive", title: "경험을 기록해요", desc: "역할, 배경, 액션, 결과까지 구조화된 틀로 경험을 남겨요. AI와 함께 대화하며 채울 수도 있어요." },
                  { step: "02", tag: "Insights", title: "패턴을 발견해요", desc: "키워드 클라우드와 타임라인으로 나의 패턴을 시각화해요. AI가 강점을 분석해줘요." },
                  { step: "03", tag: "Card", title: "나를 표현해요", desc: "AI가 뽑은 한줄 소개가 Card 페이지에 반영돼요. 나만의 포트폴리오가 완성돼요." },
                ].map((s, i) => (
                  <div key={i} className="flex flex-col gap-3" style={{ padding: 20, background: "#FBF9F9", outline: "1px solid #E2E2E2", outlineOffset: -1 }}>
                    <div className="flex items-center justify-between">
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#C6C6C7", letterSpacing: 2 }}>{s.step}</span>
                      <span style={{ fontSize: 10, color: "#5D5F5F", background: "#F0EEEE", padding: "2px 8px", borderRadius: 10 }}>{s.tag}</span>
                    </div>
                    <div style={{ width: 24, height: 1, background: "black" }} />
                    <p style={{ fontSize: 14, fontWeight: 500, color: "black" }}>{s.title}</p>
                    <p style={{ fontSize: 12, color: "#5D5F5F", lineHeight: "20px" }}>{s.desc}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => navigate("/experiences/add")}
                style={{ background: "black", color: "white", padding: "12px 24px", fontSize: 14 }}>
                첫 경험 기록하기 →
              </button>
            </div>
          </div>
        ) : (
          // 경험이 있을 때 카드 그리드
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredExperiences.slice(0, 4).map((exp) => (
              <ExperienceCard
                key={exp.id}
                exp={exp}
                onClick={() => navigate(`/experiences/${exp.id}`, { state: { from: "dashboard" } })}
                folders={folders}
                onMove={handleMoveToFolder}
              />
            ))}
          </div>
        )}
      </main>

      <button onClick={() => navigate("/experiences/add")}
        className="fixed flex items-center justify-center hover:opacity-80 transition-opacity"
        style={{ right: 16, bottom: 16, width: 48, height: 48, background: "black", borderRadius: 10, color: "white", fontSize: 24, fontWeight: 300 }}
        aria-label="경험 추가하기">
        +
      </button>
    </div>
  );
};