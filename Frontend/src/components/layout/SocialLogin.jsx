import { Linkedin } from "lucide-react";
import AuthService from "../../services/authService.js";

const GoogleIcon = ({ className }) => (
  <svg viewBox="0 0 48 48" className={className}>
    <path fill="#EA4335" d="M24 9.5c3.5 0 6.7 1.2 9.2 3.5l6.9-6.9C35.9 2.3 30.4 0 24 0 14.6 0 6.5 5.5 2.6 13.4l8 6.2C12.2 13.1 17.6 9.5 24 9.5z" />
    <path fill="#34A853" d="M46.1 24.5c0-1.6-.1-3.2-.4-4.7H24v9h12.6c-.5 3-2.2 5.5-4.7 7.2l7.3 5.7c4.2-3.9 6.9-9.7 6.9-17.2z" />
    <path fill="#4A90E2" d="M10.6 28.6c-.5-1.5-.8-3-.8-4.6s.3-3.1.8-4.6l-8-6.2C.9 16.4 0 20.1 0 24s.9 7.6 2.6 10.8l8-6.2z" />
    <path fill="#FBBC05" d="M24 48c6.4 0 11.8-2.1 15.7-5.7l-7.3-5.7c-2 1.4-4.6 2.2-8.4 2.2-6.4 0-11.8-3.6-14.5-8.8l-8 6.2C6.5 42.5 14.6 48 24 48z" />
  </svg>
);

const SocialLogin = () => {
  return (
    <>
      {/* Divider */}
      <div className="my-4 flex items-center gap-3">
        <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
        <span className="text-[11px] font-mono text-zinc-400">OR</span>
        <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {/* Google */}
        <button
          onClick={() => {
            AuthService.loginWithGoogle();
            localStorage.setItem("trueLogin", "true");
          }}
          className="group flex items-center justify-center gap-2 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#19191b] hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition-colors duration-150 active:scale-[0.98]"
        >
          <GoogleIcon className="w-4 h-4" />
          <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Google
          </span>
        </button>

        {/* LinkedIn */}
        <button
          onClick={() => {
            AuthService.loginWithLinkedin();
            localStorage.setItem("trueLogin", "true");
          }}
          className="group flex items-center justify-center gap-2 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#19191b] hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition-colors duration-150 active:scale-[0.98]"
        >
          <Linkedin className="w-4 h-4 text-[#0A66C2]" />
          <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            LinkedIn
          </span>
        </button>
      </div>
    </>
  );
};

export default SocialLogin;
