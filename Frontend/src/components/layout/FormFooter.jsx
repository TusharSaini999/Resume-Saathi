import { Link } from "react-router";
const FormFooter = ({ type = "" }) => {
    return (
        <div className="mt-4 flex items-center justify-between text-xs">

            {/* Left - Back to Home */}
            <Link
                to="/"
                className="text-[#FE3E91] dark:text-[#FF5FA7] font-semibold hover:text-[#FF66A8] dark:hover:text-[#FA7DB3] transition-colors"
            >
                ← Home
            </Link>

            {/* Signup Page */}
            {type === "signup" && (
                <div>
                    <span className="text-[#64748B] dark:text-[#94A3B8]">
                        Already have an account?{" "}
                    </span>
                    <Link
                        to="/auth/login"
                        className="text-[#FE3E91] dark:text-[#FF5FA7] font-semibold hover:text-[#FF66A8] dark:hover:text-[#FA7DB3] transition-colors"
                    >
                        Sign in
                    </Link>
                </div>
            )}

            {/* Login Page */}
            {type === "login" && (
                <div>
                    <span className="text-[#64748B] dark:text-[#94A3B8]">
                        Don't have an account?{" "}
                    </span>
                    <Link
                        to="/auth/register"
                        className="text-[#FE3E91] dark:text-[#FF5FA7] font-semibold hover:text-[#FF66A8] dark:hover:text-[#FA7DB3] transition-colors"
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
                        className="text-[#FE3E91] dark:text-[#FF5FA7] font-semibold hover:text-[#FF66A8] dark:hover:text-[#FA7DB3] transition-colors"
                    >
                        ← Back to Login
                    </Link>
                </div>
            )}

        </div>
    );
};

export default FormFooter;