import { useEffect, useState } from "react";

const SplashScreen = ({ show = true }) => {
    const [isEntered, setIsEntered] = useState(false);

    const isDark = localStorage.getItem("isDark") === "true";
    const logoSrc = isDark
        ? `${import.meta.env.BASE_URL}Logo/darkLogo.png`
        : `${import.meta.env.BASE_URL}Logo/lightLogo.png`;

    useEffect(() => {
        const frame = window.requestAnimationFrame(() => {
            setIsEntered(true);
        });

        return () => {
            window.cancelAnimationFrame(frame);
        };
    }, []);

    if (!show) return null;

    return (
        <section
            className={`fixed inset-0 z-100 flex items-center justify-center overflow-hidden transition-all duration-500 ease-out ${
                "opacity-100"
            } ${
                isDark
                    ? "bg-[radial-gradient(circle_at_top,#1f2937_0%,#0b1120_55%,#030712_100%)]"
                    : "bg-[radial-gradient(circle_at_top,#fef3f8_0%,#fdf2f8_35%,#f8fafc_100%)]"
            }`}
            role="status"
            aria-live="polite"
            aria-label="Loading ResumeSaathi"
        >
            <div
                className={`absolute -top-28 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl ${
                    isDark ? "bg-fuchsia-500/25" : "bg-pink-300/40"
                }`}
            />

            <div
                className={`relative flex flex-col items-center gap-5 transition-all duration-500 ease-out ${
                    isEntered
                        ? "translate-y-0 scale-100 opacity-100"
                        : "translate-y-4 scale-90 opacity-0"
                }`}
            >
                <div className="relative grid place-items-center">
                    {isDark ? (
                        <div className="absolute h-28 w-28 rounded-full border border-white/25 border-t-transparent animate-spin [animation-duration:1.8s]" />
                    ) : (
                        <div className="absolute h-28 w-28 rounded-full border border-gray-300 border-t-transparent animate-spin [animation-duration:1.8s]" />
                    )}

                    <div className="absolute h-20 w-20 rounded-full border border-pink-400/40 border-b-transparent animate-spin [animation-duration:1.2s] [animation-direction:reverse]" />

                    <img
                        src={logoSrc}
                        alt="ResumeSaathi Logo"
                        className="relative z-10 h-16 w-16 rounded-2xl border-2 border-pink-500/70 shadow-[0_0_30px_rgba(236,72,153,0.45)] animate-[pulse_1.8s_ease-in-out_infinite]"
                    />
                </div>

                <h1
                    className={`text-2xl font-black tracking-wide ${
                        isDark ? "text-white" : "text-slate-800"
                    }`}
                >
                    Resume
                    <span
                        className="bg-linear-to-r from-[#fe3e91] via-[#ca25af] to-[#803ad1] 
                        bg-clip-text text-transparent 
                        dark:from-[#ff5fa7] dark:via-[#d340bd] dark:to-[#9d65d5]"
                    >
                        Saathi
                    </span>
                </h1>
            </div>
        </section>
    );
};

export default SplashScreen;
