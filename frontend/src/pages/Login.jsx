import googleIcon from "../assets/google-icon.svg";
import arrowLeft from "../assets/arrow-left.svg";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5001";

const policyLinks = [
  { id: "terms", label: "이용약관", href: "#" },
  { id: "privacy", label: "개인정보처리방침", href: "#" },
];

export const Login = () => {
  const handleGoogleLogin = () => {
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#efeded] px-4 py-16 sm:px-16">
      <section className="relative flex w-full max-w-md flex-col items-start">
        <div className="relative flex w-full flex-col items-center border border-solid border-black bg-white p-12 shadow-[0px_1px_2px_#0000000d]">
          {/* 로고 */}
          <header className="flex flex-col items-center pb-12">
            <span className="text-[32px] font-semibold leading-tight tracking-[-1.6px] text-black [font-family:'Playfair_Display',serif]">
              ITER
            </span>
          </header>

          {/* 타이틀 */}
          <h1 className="mb-4 text-[32px] font-normal leading-tight tracking-[0] text-[#1b1c1c]">
            로그인/회원가입
          </h1>

          {/* 설명 */}
          <p className="mb-16 text-base text-[#4c4546]">
            Google 계정으로 간편하게 시작할 수 있어요.
          </p>

          {/* Google 로그인 버튼 */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex w-full items-center justify-center gap-2 bg-black px-6 py-4 transition-opacity hover:opacity-90"
            aria-label="Google로 계속하기"
          >
            <img className="h-[15px] w-[15px]" alt="" src={googleIcon} aria-hidden="true" />
            <span className="text-base font-medium text-white [font-family:'Inter',sans-serif]">
              Google로 계속하기
            </span>
          </button>

          {/* 약관 안내 */}
          <div className="mt-8 text-center text-sm leading-[1.4] tracking-[0.7px] text-[#7e7576]">
            <span>계속 진행하면 ITER의 </span>
            <a href={policyLinks[0].href} className="text-black underline">
              {policyLinks[0].label}
            </a>
            <span> 및 </span>
            <a href={policyLinks[1].href} className="text-black underline">
              {policyLinks[1].label}
            </a>
            <span>에 동의하게 됩니다.</span>
          </div>

          {/* 이전으로 버튼 */}
          <div className="mt-12 flex w-full justify-center">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="flex items-center gap-1 text-sm text-[#5d5f5f]"
            >
              <img className="h-[10.67px] w-[10.67px]" alt="" src={arrowLeft} aria-hidden="true" />
              <span>이전으로</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};
