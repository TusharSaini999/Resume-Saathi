import { Link, useRouteError } from "react-router";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { BUTTON_CLASS } from "../constants/style";

const GlobalError = () => {
  const error = useRouteError();
  const status = error?.status || 404;
  const message = error?.statusText || "The requested page was not found.";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#fafafa] dark:bg-[#141415] text-zinc-900 dark:text-zinc-100">
      <div className="w-full max-w-md rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-[#19191b] p-8 text-center shadow-xs">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
          <AlertCircle size={24} />
        </div>

        <p className="font-mono text-3xl font-medium tabular-nums text-zinc-900 dark:text-zinc-100">
          {status}
        </p>

        <h1 className="mt-2 text-base font-medium text-zinc-800 dark:text-zinc-200">
          Page error
        </h1>

        <p className="mt-1 text-xs text-zinc-500 leading-relaxed">
          {message}
        </p>

        <div className="mt-6 flex justify-center">
          <Link to="/" className={BUTTON_CLASS}>
            <ArrowLeft size={14} />
            <span>Return to overview</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GlobalError;
