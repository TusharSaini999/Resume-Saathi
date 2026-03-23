import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import SignupSidePanel from "../components/layout/SignupSidePanel";
import SocialLogin from "../components/layout/SocialLogin";
import FormFooter from "../components/layout/FormFooter";
import ErrorForm from "../components/layout/ErrorForm";
import AuthService from "../services/authService";
import { useDispatch } from "react-redux";
import { setLogin } from "../context/authSlice";

const Signup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const dispatch = useDispatch();

    const onSubmit = async (data) => {
        setLoading(true);
        setError(null);
        try {
            const response = await AuthService.signup({
                name: data.fullName,
                email: data.email,
                password: data.password,
            });
            if (response.success) {
                dispatch(setLogin(response.data));
                if (response.statusCode === 200 && response.data.email_verified) {
                    navigate("/dashboard");
                } else {
                    navigate("/auth/verify-email");
                }
                console.log("Signup successful:", response);
            } else {
                setError(response.message || "Failed to create account");
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

    return (
        <div className="h-screen overflow-hidden flex items-center justify-center bg-[#FFFFFF] dark:bg-[#111827] px-4">

            {/* Gradient Background */}
            <div className="absolute inset-0 opacity-20 blur-3xl pointer-events-none">
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#803AD1] rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FE3E91] rounded-full"></div>
            </div>

            {/* Container */}
            <div
                className="relative w-full max-w-6xl h-[90vh] rounded-3xl shadow-2xl border border-[#E5E7EB] dark:border-[#374151] overflow-hidden bg-[#FFFFFF] dark:bg-[#1F2937]"
                style={{ boxShadow: "0 25px 50px rgba(0,0,0,0.2)" }}
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 h-full">

                    {/* LEFT SIDE - Side Panel */}
                    <SignupSidePanel />

                    {/* RIGHT SIDE - Form */}
                    <div className="flex flex-col justify-center px-6 sm:px-10 lg:px-12 py-6 overflow-y-auto">

                        {/* Header */}
                        <div className="mb-6">
                            <h1 className="text-3xl sm:text-4xl font-bold text-[#1E293B] dark:text-white">
                                Create Account ✨
                            </h1>
                            <p className="mt-1 text-sm text-[#475569] dark:text-[#94A3B8]">
                                Join <span className="text-[#FE3E91] dark:text-[#FF5FA7] font-medium hover:text-[#FF66A8] dark:hover:text-[#FA7DB3] transition-colors">Resume Saathi</span> and boost your career
                            </p>
                        </div>

                        {/* Form */}
                        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>

                            {/* Full Name */}
                            <div>
                                <label className="text-sm font-medium text-[#1E293B] dark:text-white">
                                    Full Name
                                </label>
                                <div className="relative mt-1">
                                    <User className="absolute left-3 top-3 w-5 h-5 text-[#64748B] dark:text-[#94A3B8]" />
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        disabled={loading}
                                        {...register("fullName", {
                                            required: "Full name is required",
                                            minLength: {
                                                value: 2,
                                                message: "Full name must be at least 2 characters",
                                            },
                                        })}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm text-[#1E293B] dark:text-white placeholder:text-[#64748B] dark:placeholder:text-[#94A3B8] bg-[#F9FAFB] dark:bg-[#374151] border border-[#E5E7EB] dark:border-[#374151] focus:ring-2 focus:ring-[#FE3E91] dark:focus:ring-[#FF5FA7] focus:border-transparent outline-none transition"
                                    />
                                </div>
                                {errors.fullName && <p className="mt-1 text-xs text-red-400">{errors.fullName.message}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="text-sm font-medium text-[#1E293B] dark:text-white">
                                    Email Address
                                </label>
                                <div className="relative mt-1">
                                    <Mail className="absolute left-3 top-3 w-5 h-5 text-[#64748B] dark:text-[#94A3B8]" />
                                    <input
                                        type="email"
                                        placeholder="you@example.com"
                                        disabled={loading}
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^\S+@\S+$/i,
                                                message: "Invalid email address",
                                            },
                                        })}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm text-[#1E293B] dark:text-white placeholder:text-[#64748B] dark:placeholder:text-[#94A3B8] bg-[#F9FAFB] dark:bg-[#374151] border border-[#E5E7EB] dark:border-[#374151] focus:ring-2 focus:ring-[#FE3E91] dark:focus:ring-[#FF5FA7] focus:border-transparent outline-none transition"
                                    />
                                </div>
                                {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="text-sm font-medium text-[#1E293B] dark:text-white">
                                    Password
                                </label>
                                <div className="relative mt-1">
                                    <Lock className="absolute left-3 top-3 w-5 h-5 text-[#64748B] dark:text-[#94A3B8]" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Create a password"
                                        disabled={loading}
                                        {...register("password", {
                                            required: "Password is required",
                                            minLength: {
                                                value: 8,
                                                message: "Password must be at least 8 characters",
                                            },
                                        })}
                                        className="w-full pl-10 pr-10 py-2.5 rounded-lg text-sm text-[#1E293B] dark:text-white placeholder:text-[#64748B] dark:placeholder:text-[#94A3B8] bg-[#F9FAFB] dark:bg-[#374151] border border-[#E5E7EB] dark:border-[#374151] focus:ring-2 focus:ring-[#FE3E91] dark:focus:ring-[#FF5FA7] focus:border-transparent outline-none transition"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3 text-[#64748B] dark:text-[#94A3B8] hover:text-[#FE3E91] dark:hover:text-[#FF5FA7] transition"
                                    >
                                        {showPassword ? <EyeOff /> : <Eye />}
                                    </button>
                                </div>
                                {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
                            </div>


                            <ErrorForm error={error} />

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-2.5 rounded-lg text-white font-semibold
                bg-linear-to-r from-[#803AD1] via-[#CA25AF] to-[#FE3E91]
                dark:from-[#9D65D5] dark:via-[#D340BD] dark:to-[#FF5FA7]
                hover:opacity-90 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ boxShadow: "0 8px 20px rgba(128, 58, 209, 0.25)" }}
                            >
                                {loading ? "Creating Account..." : (
                                    <>
                                        <UserPlus className="inline mr-2" />
                                        Create Account
                                    </>
                                )}
                            </button>
                        </form>

                        <SocialLogin />

                        {/* Footer */}
                        <FormFooter type="signup" />

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
