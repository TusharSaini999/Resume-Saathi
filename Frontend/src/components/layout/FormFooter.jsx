import { Link } from "react-router";

const FormFooter = ({ type = "" }) => {
  return (
    <div className="mt-4 flex items-center justify-between text-xs">
      {/* Left - Back to Home */}
      <Link
        to="/"
        className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
      >
        &larr; Home
      </Link>

      {/* Signup Page */}
      {type === "signup" && (
        <div>
          <span className="text-zinc-500">
            Already have an account?{" "}
          </span>
          <Link
            to="/auth/login"
            className="text-[#fe3e91] font-medium hover:underline transition-colors"
          >
            Sign in
          </Link>
        </div>
      )}

      {/* Login Page */}
      {type === "login" && (
        <div>
          <span className="text-zinc-500">
            Don't have an account?{" "}
          </span>
          <Link
            to="/auth/register"
            className="text-[#fe3e91] font-medium hover:underline transition-colors"
          >
            Sign up
          </Link>
        </div>
      )}

      {/* Forgot Password Page */}
      {type === "forgot" && (
        <div>
          <Link
            to="/auth/login"
            className="text-[#fe3e91] font-medium hover:underline transition-colors"
          >
            Back to sign in
          </Link>
        </div>
      )}
    </div>
  );
};

export default FormFooter;
