import { useState } from "react";
import googleIcon from "../assets/google-icon.svg";
import arrowLeft from "../assets/arrow-left.svg";
import { saveToken } from "../auth";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5001";

const policyLinks = [
  { id: "terms", label: "이용약관", href: "#" },
  { id: "privacy", label: "개인정보처리방침", href: "#" },
];

export const Login = () => {
  const [mode, setMode] = useState("main");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = () => {
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  const handleEmailLogin = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        saveToken(data.access_token);
        window.location.href = "/profile";
      } else {
        setMessage("이메일 또는 비밀번호가 올바르지 않아요.");
      }
    } catch {
      setMessage("서버에 연결할 수 없어요.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${BACKEND_URL}/auth/signup`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("가입 완료! 이메일 인증 후 로그인해주세요.");
        setMode("login");
      } else {
        setMessage(data.error || "회원가입에 실패했어요.");
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
        <div className="relative flex w-full flex-col items-center border border-solid border-black bg-white p-12 shadow-[0px_1px_2px_#0000000d]">
          
          {/* 로고 */}
          <header className="flex flex-col items-center pb-6">
            <span className="text-2xl font-semibold tracking-[-1px] text-black [font-family:'Playfair_Display',serif]">
              ITER
            </span>
          </header>

          {/* 메인 화면 */}
          {mode === "main" && (
            <>
              <h1 className="mb-2 text-2xl font-normal text-[#1b1c1c]">
                로그인/회원가입
              </h1>
              <p className="mb-8 text-base text-[#4c4546]">
                Google 계정으로 간편하게 시작할 수 있어요.
              </p>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex w-full items-center justify-center gap-2 bg-black px-4 py-3 transition-opacity hover:opacity-90 mb-2"
              >
                <img className="h-[13px] w-[13px]" alt="" src={googleIcon} aria-hidden="true" />
                <span className="text-base font-medium text-white [font-family:'Inter',sans-serif]">
                  Google로 계속하기
                </span>
              </button>

              <div className="flex w-full items-center gap-3 my-3">
                <div className="flex-1 h-px bg-[#DBDAD9]" />
                <span className="text-sm text-[#7e7576]">또는</span>
                <div className="flex-1 h-px bg-[#DBDAD9]" />
              </div>

              <button
                type="button"
                onClick={() => setMode("login")}
                className="w-full border border-black px-4 py-3 text-base text-black hover:bg-gray-50 transition-colors mb-2"
              >
                이메일로 로그인
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="w-full border border-[#C6C6C7] px-4 py-3 text-base text-[#5D5F5F] hover:bg-gray-50 transition-colors"
              >
                이메일로 회원가입
              </button>

              <div className="mt-6 text-center text-sm leading-[1.4] tracking-[0.5px] text-[#7e7576]">
                <span>계속 진행하면 ITER의 </span>
                <a href={policyLinks[0].href} className="text-black underline">{policyLinks[0].label}</a>
                <span> 및 </span>
                <a href={policyLinks[1].href} className="text-black underline">{policyLinks[1].label}</a>
                <span>에 <p> </p>동의하게 됩니다.</span>
              </div>
            </>
          )}

          {/* 이메일 로그인 */}
          {mode === "login" && (
            <>
              <h1 className="mb-6 text-xl font-normal text-[#1b1c1c]">이메일 로그인</h1>
              <div className="w-full flex flex-col gap-3">
                <input type="email" placeholder="이메일" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-b border-black px-2 py-2 text-base outline-none placeholder:text-[#C6C6C7]" />
                <input type="password" placeholder="비밀번호" value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleEmailLogin()}
                  className="w-full border-b border-black px-2 py-2 text-base outline-none placeholder:text-[#C6C6C7]" />
              </div>
              {message && <p className="mt-3 text-sm text-red-500">{message}</p>}
              <button type="button" onClick={handleEmailLogin} disabled={loading}
                className="mt-6 w-full bg-black px-4 py-3 text-base text-white hover:opacity-90 transition-opacity disabled:opacity-50">
                {loading ? "로그인 중..." : "로그인"}
              </button>
              <button type="button" onClick={() => setMode("signup")}
                className="mt-2 text-base text-[#5D5F5F] underline">
                아직 계정이 없어요 → 회원가입
              </button>
            </>
          )}

          {/* 이메일 회원가입 */}
          {mode === "signup" && (
            <>
              <h1 className="mb-6 text-xl font-normal text-[#1b1c1c]">회원가입</h1>
              <div className="w-full flex flex-col gap-3">
                <input type="text" placeholder="이름" value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-b border-black px-2 py-2 text-base outline-none placeholder:text-[#C6C6C7]" />
                <input type="email" placeholder="이메일" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-b border-black px-2 py-2 text-base outline-none placeholder:text-[#C6C6C7]" />
                <input type="password" placeholder="비밀번호 (6자 이상)" value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                  className="w-full border-b border-black px-2 py-2 text-base outline-none placeholder:text-[#C6C6C7]" />
              </div>
              {message && (
                <p className={`mt-3 text-base ${message.includes("완료") ? "text-green-600" : "text-red-500"}`}>
                  {message}
                </p>
              )}
              <button type="button" onClick={handleSignup} disabled={loading}
                className="mt-6 w-full bg-black px-4 py-3 text-base text-white hover:opacity-90 transition-opacity disabled:opacity-50">
                {loading ? "가입 중..." : "가입하기"}
              </button>
              <button type="button" onClick={() => setMode("login")}
                className="mt-2 text-base text-[#5D5F5F] underline">
                이미 계정이 있어요 → 로그인
              </button>
            </>
          )}

          {/* 이전으로 */}
          <div className="mt-8 flex w-full justify-center">
            <button type="button"
              onClick={() => mode === "main" ? window.location.href = "/" : setMode("main")}
              className="flex items-center gap-1 text-base text-[#5d5f5f]">
              <img className="h-[9px] w-[9px]" alt="" src={arrowLeft} aria-hidden="true" />
              <span>이전으로</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};