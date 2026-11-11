import { useEffect, useState } from "react";

const SplashScreen = ({ show = true }) => {
  const [isEntered, setIsEntered] = useState(false);
  const publicBaseUrl = import.meta.env.BASE_URL;

  const isDark = localStorage.getItem("isDark") === "true";
  const logoSrc = isDark
    ? `${publicBaseUrl}Logo/darkLogo.png`
    : `${publicBaseUrl}Logo/lightLogo.png`;

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
      className={`fixed inset-0 z-100 flex items-center justify-center overflow-hidden transition-opacity duration-300 ${
        isDark ? "bg-[#141415]" : "bg-[#fafafa]"
      }`}
      role="status"
      aria-live="polite"
      aria-label="Loading Resume Saathi"
    >
      <div
        className={`relative flex flex-col items-center gap-4 transition-all duration-300 ease-out ${
          isEntered ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="relative grid place-items-center">
          <div className="absolute h-20 w-20 rounded-full border border-[#fe3e91]/40 border-t-transparent animate-spin [animation-duration:1.2s]" />

          <img
            src={logoSrc}
            alt="Resume Saathi Logo"
            className="relative z-10 h-12 w-12 rounded-lg object-contain"
          />
        </div>

        <h1 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Resume <span className="text-[#fe3e91]">Saathi</span>
        </h1>
      </div>
    </section>
  );
};

export default SplashScreen;
