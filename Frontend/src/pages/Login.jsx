import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, LogIn, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import LoginSidePanel from "../components/layout/LoginSidePanel";
import SocialLogin from "../components/layout/SocialLogin";
import FormFooter from "../components/layout/FormFooter";
import AuthService from "../services/authService";
import ErrorForm from "../components/layout/ErrorForm";
import { useDispatch } from "react-redux";
import { setLogin } from "../context/authSlice";
const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        setLoading(true);
        setError(null);
        try {
            const response = await AuthService.login(data);
            if (response.success) {
                console.log("Login successfull", response);
                dispatch(setLogin(response.data));
                if (response.statusCode == 200 && response?.data?.email_verified) {
                    navigate("/dashboard");
                } else {
                    navigate("/auth/verify-email");
                }
            } else {
                setError(response.message || "Login failed");
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setTimeout(() => {
                setError(null);
            }, 5000);
            setLoading(false);
        }
    };

    // Reusable Styles
    const inputClass =
        "w-full pl-10 pr-4 py-2.5 rounded-lg text-sm text-[#1E293B] dark:text-white placeholder:text-[#64748B] dark:placeholder:text-[#94A3B8] bg-[#F9FAFB] dark:bg-[#374151] border focus:ring-2 focus:ring-[#FE3E91] dark:focus:ring-[#FF5FA7] focus:border-transparent outline-none transition";

    const errorClass = "text-xs text-bold text-red-400 mt-1";

    return (
        <div className="h-screen overflow-hidden flex items-center justify-center bg-[#FFFFFF] dark:bg-[#111827] px-4">

            {/* Background */}
            <div className="absolute inset-0 opacity-20 blur-3xl pointer-events-none">
                <div className="absolute top-0 left-0 w-80 h-80 bg-[#FE3E91] rounded-full"></div>
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#803AD1] rounded-full"></div>
            </div>

            {/* Container */}
            <div className="relative w-full max-w-6xl h-[90vh] rounded-3xl shadow-2xl border border-[#E5E7EB] dark:border-[#374151] overflow-hidden bg-[#FFFFFF] dark:bg-[#1F2937]">

                <div className="grid grid-cols-1 lg:grid-cols-2 h-full">

                    {/* RIGHT */}
                    <LoginSidePanel />

                    {/* LEFT */}
                    <div className="flex flex-col justify-center px-6 sm:px-10 lg:px-12 py-6">

                        {/* Header */}
                        <div className="mb-6 text-center lg:text-left">
                            <h1 className="text-3xl sm:text-4xl font-bold text-[#1E293B] dark:text-white">
                                Access Your Account 🔐
                            </h1>
                            <p className="mt-1 text-sm text-[#475569] dark:text-[#94A3B8]">
                                Sign in to your{" "}
                                <span className="text-[#FE3E91] font-medium">
                                    Resume Saathi
                                </span>{" "}
                                account
                            </p>
                        </div>

                        {/* Form */}
                        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>

                            {/* Email */}
                            <div>
                                <label className="text-sm font-medium text-[#1E293B] dark:text-white">
                                    Email Address
                                </label>

                                <div className="relative mt-1">
                                    <Mail className="absolute left-3 top-3 w-5 h-5 text-[#64748B]" />

                                    <input
                                        type="text"
                                        placeholder="you@example.com"
                                        disabled={loading}
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^\S+@\S+$/i,
                                                message: "Invalid email address",
                                            },
                                        })}
                                        className={`${inputClass} ${errors.email
                                            ? "border-red-500"
                                            : "border-[#E5E7EB] dark:border-[#374151]"
                                            }`}
                                    />
                                </div>

                                {errors.email && (
                                    <p className={errorClass}>
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="text-sm font-medium text-[#1E293B] dark:text-white">
                                    Password
                                </label>

                                <div className="relative mt-1">
                                    <Lock className="absolute left-3 top-3 w-5 h-5 text-[#64748B]" />

                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        disabled={loading}
                                        {...register("password", {
                                            required: "Password is required",
                                            minLength: {
                                                value: 8,
                                                message: "Minimum 8 characters",
                                            },
                                        })}
                                        className={`${inputClass} pr-10 ${errors.password
                                            ? "border-red-500"
                                            : "border-[#E5E7EB] dark:border-[#374151]"
                                            }`}
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-3 top-3 text-[#64748B] hover:text-[#FE3E91]"
                                    >
                                        {showPassword ? <EyeOff /> : <Eye />}
                                    </button>
                                </div>

                                {errors.password && (
                                    <p className={errorClass}>
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            {/* Forgot */}
                            <div className="text-right text-xs">
                                <Link
                                    to="/auth/forgot-password"
                                    className="text-[#FE3E91] font-medium hover:text-[#FF66A8]"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            {/* Button */}
                            <ErrorForm error={error} />

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-2.5 rounded-lg text-white font-semibold 
                                bg-linear-to-r from-[#FE3E91] via-[#CA25AF] to-[#803AD1]
                                hover:scale-[1.02] active:scale-95 transition-all disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="inline mr-2 animate-spin" />
                                        Signing In...
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="inline mr-2" />
                                        Sign In
                                    </>
                                )}
                            </button>
                        </form>

                        <SocialLogin />

                        <FormFooter type="login" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;