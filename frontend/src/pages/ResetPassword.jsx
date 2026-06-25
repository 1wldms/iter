import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saveToken } from "../auth";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5001";

export const ResetPassword = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState("");

    useEffect(() => {
        const hash = window.location.hash;
        const params = new URLSearchParams(hash.substring(1)); // # 제거
        const accessToken = params.get("access_token");
        const type = params.get("type");
        
        console.log("hash:", hash);
        console.log("access_token:", accessToken);
        console.log("type:", type);
        
        if (accessToken && type === "recovery") {
            setToken(accessToken);
            saveToken(accessToken);
        } else if (accessToken) {
            setToken(accessToken);
            saveToken(accessToken);
        } else {
            setMessage("유효하지 않은 링크예요.");
        }
    }, []);

    const handleReset = async () => {
        if (password.length < 6) {
            setMessage("비밀번호는 6자 이상이어야 해요.");
            return;
        }
        setLoading(true);
        setMessage("");
        try {
            const res = await fetch(`${BACKEND_URL}/auth/update-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ password }),
            });
            const data = await res.json();
            if (res.ok) {
                setMessage("비밀번호가 변경됐어요! 로그인해주세요.");
                setTimeout(() => navigate("/login"), 2000);
            } else {
                setMessage(data.error || "실패했어요.");
            }
        } catch {
            setMessage("서버에 연결할 수 없어요.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex h-screen flex-col items-center justify-center bg-[#efeded]">
            <section className="relative flex w-full max-w-md flex-col items-start">
                <div className="relative flex w-full flex-col items-center border border-solid border-black bg-white p-12">
                    <span className="text-2xl font-semibold tracking-[-1px] text-black [font-family:'Playfair_Display',serif] mb-6">
                        ITER
                    </span>
                    <h1 className="mb-2 text-xl font-normal text-[#1b1c1c]">새 비밀번호 설정</h1>
                    <p className="mb-6 text-sm text-[#5D5F5F]">새로운 비밀번호를 입력해주세요.</p>
                    <input type="password" placeholder="새 비밀번호 (6자 이상)" value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleReset()}
                        className="w-full border-b border-black px-2 py-2 text-base outline-none placeholder:text-[#C6C6C7] mb-4" />
                    {message && (
                        <p className={`mb-4 text-sm ${message.includes("변경됐어요") ? "text-green-600" : "text-red-500"}`}>
                            {message}
                        </p>
                    )}
                    <button type="button" onClick={handleReset} disabled={loading || !token}
                        className="w-full bg-black px-4 py-3 text-base text-white hover:opacity-90 transition-opacity disabled:opacity-50">
                        {loading ? "변경 중..." : "비밀번호 변경"}
                    </button>
                </div>
            </section>
        </main>
    );
};