import { useState, useEffect } from "react";
import { Mail, RefreshCw, CheckCircle, Loader2, InboxIcon, MailOpen } from "lucide-react";
import { useNavigate } from "react-router";
import AuthService from "../services/authService";
import { useSelector, useDispatch } from "react-redux";
import { updateExpiration } from "../context/authSlice";
const getRemainingSeconds = (expiresAt) => {
    if (!expiresAt) return 0;
    const expiresAtMs = new Date(expiresAt).getTime();
    if (Number.isNaN(expiresAtMs)) return 0;

    return Math.max(0, Math.ceil((expiresAtMs - Date.now()) / 1000));
};

const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

const VerifyEmail = () => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const user = useSelector((state) => state.auth?.user);
    const userId = user?._id;
    const email = user?.email;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [cooldown, setCooldown] = useState(() =>
        user?.email_Send ? getRemainingSeconds(user?.email_ExpiresAt) : 0
    );

    useEffect(() => {
        if (!userId) {
            navigate("/error");
        }

        if (user?.email_Send) {
            setCooldown(getRemainingSeconds(user?.email_ExpiresAt));
        }

    }, [userId, user?.email_Send, user?.email_ExpiresAt, user]);

    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);

    const handleResend = async () => {
        if (!userId || loading || cooldown > 0) return;
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            const response = await AuthService.resendVerificationEmail(userId);
            if (response.success) {
                dispatch(updateExpiration(response.data.email_ExpiresAt));
                setSuccess(true);
                setTimeout(() => setSuccess(false), 5000);
            } else {
                setError(response.message || "Failed to resend email. Please try again.");
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
            if (error) setTimeout(() => setError(null), 5000);
        }
    };

    return (
        <div className="h-screen overflow-hidden flex items-center justify-center bg-[#FFFFFF] dark:bg-[#111827] px-4">

            {/* Gradient Background Blobs */}
            <div className="absolute inset-0 opacity-20 blur-3xl pointer-events-none">
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#803AD1] rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FE3E91] rounded-full"></div>
            </div>

            {/* Card Container */}
            <div
                className="relative w-full max-w-6xl h-[90vh] rounded-3xl shadow-2xl border border-[#E5E7EB] dark:border-[#374151] overflow-hidden bg-[#FFFFFF] dark:bg-[#1F2937]"
                style={{ boxShadow: "0 25px 50px rgba(0,0,0,0.2)" }}
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 h-full">

                    {/* LEFT SIDE - Decorative Panel */}
                    <div className="hidden lg:flex flex-col justify-center items-center p-12 h-full relative overflow-hidden
            bg-linear-to-br from-[#803AD1]/10 via-[#CA25AF]/10 to-[#FE3E91]/10
            dark:from-[#9D65D5]/15 dark:via-[#D340BD]/15 dark:to-[#FF5FA7]/15
            border-r border-[#E5E7EB] dark:border-[#374151]">

                        {/* Orbs */}
                        <div className="absolute top-0 left-0 w-40 h-40 bg-[#803AD1] dark:bg-[#9D65D5] rounded-full blur-3xl opacity-20"></div>
                        <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#FE3E91] dark:bg-[#FF5FA7] rounded-full blur-3xl opacity-20"></div>

                        <div className="relative z-10 text-center max-w-sm">

                            {/* Animated Icon */}
                            <div className="mb-8 flex justify-center">
                                <div
                                    className="w-24 h-24 rounded-3xl bg-linear-to-br from-[#803AD1] to-[#FE3E91] dark:from-[#9D65D5] dark:to-[#FF5FA7] flex items-center justify-center shadow-2xl animate-bounce"
                                    style={{ boxShadow: "0 10px 30px rgba(128, 58, 209, 0.35)", animationDuration: "2s" }}
                                >
                                    <MailOpen className="w-12 h-12 text-white" />
                                </div>
                            </div>

                            {/* Title */}
                            <h2 className="text-3xl font-bold text-[#1E293B] dark:text-white mb-4">
                                Almost There!
                            </h2>
                            <p className="text-sm text-[#475569] dark:text-[#94A3B8] mb-8">
                                Just one step left — verify your email to unlock Resume Saathi.
                            </p>

                            {/* Steps */}
                            <div className="space-y-4 text-left">
                                {[
                                    { step: "1", label: "Check your inbox", sub: "Look for an email from Resume Saathi" },
                                    { step: "2", label: "Open the email", sub: "Find the verification message we sent" },
                                    { step: "3", label: "Click the link", sub: "Confirm your email to get started" },
                                ].map(({ step, label, sub }) => (
                                    <div
                                        key={step}
                                        className="flex items-center gap-3 p-4 rounded-xl bg-[#FFFFFF]/70 dark:bg-[#1F2937]/70 backdrop-blur-md border border-[#E5E7EB]/60 dark:border-[#374151]/60 hover:scale-[1.02] hover:shadow-md transition"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-linear-to-r from-[#803AD1] to-[#FE3E91] dark:from-[#9D65D5] dark:to-[#FF5FA7] flex items-center justify-center shrink-0 text-white text-sm font-bold shadow-md">
                                            {step}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-[#1E293B] dark:text-white text-sm">{label}</p>
                                            <p className="text-xs text-[#475569] dark:text-[#94A3B8]">{sub}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE - Content */}
                    <div className="flex flex-col justify-center px-6 sm:px-10 lg:px-12 py-6 overflow-y-auto">

                        {/* Email icon */}
                        <div className="flex justify-center lg:justify-start mb-6">
                            <div
                                className="w-20 h-20 rounded-2xl bg-linear-to-br from-[#803AD1] via-[#CA25AF] to-[#FE3E91] dark:from-[#9D65D5] dark:via-[#D340BD] dark:to-[#FF5FA7] flex items-center justify-center shadow-lg"
                                style={{ boxShadow: "0 8px 24px rgba(128, 58, 209, 0.3)" }}
                            >
                                <Mail className="w-10 h-10 text-white" />
                            </div>
                        </div>

                        {/* Header */}
                        <div className="mb-6">
                            <h1 className="text-3xl sm:text-4xl font-bold text-[#1E293B] dark:text-white">
                                Check Your Email 📬
                            </h1>
                            <p className="mt-2 text-sm text-[#475569] dark:text-[#94A3B8]">
                                We sent a verification link to{" "}
                                {email ? (
                                    <span className="font-semibold text-[#FE3E91] dark:text-[#FF5FA7]">{email}</span>
                                ) : (
                                    "your email address"
                                )}
                                . Click the link to activate your account.
                            </p>
                        </div>

                        {/* Info Box */}
                        <div className="mb-6 p-4 rounded-xl border border-[#E5E7EB] dark:border-[#374151] bg-[#F9FAFB] dark:bg-[#374151]/40">
                            <div className="flex items-start gap-3">
                                <InboxIcon className="w-5 h-5 text-[#803AD1] dark:text-[#9D65D5] shrink-0 mt-0.5" />
                                <div className="text-sm text-[#475569] dark:text-[#94A3B8] space-y-1">
                                    <p>Can't find the email? Check your <span className="font-medium text-[#1E293B] dark:text-white">spam or junk folder</span>.</p>
                                    <p>The link expires in <span className="font-medium text-[#1E293B] dark:text-white">15 min</span>.</p>
                                </div>
                            </div>
                        </div>

                        {/* Success Message */}
                        {success && (
                            <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-200 dark:border-green-500/40 bg-green-50 dark:bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-300">
                                <CheckCircle className="w-4 h-4 shrink-0" />
                                <span>Verification email resent successfully! Please check your inbox.</span>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="mb-4 rounded-lg border border-red-200 dark:border-red-500/40 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                                {error}
                            </div>
                        )}

                        {/* Resend Button */}
                        {userId && (
                            <>
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    disabled={loading || cooldown > 0}
                                    className="w-full py-2.5 rounded-lg text-white font-semibold
                  bg-linear-to-r from-[#803AD1] via-[#CA25AF] to-[#FE3E91]
                  dark:from-[#9D65D5] dark:via-[#D340BD] dark:to-[#FF5FA7]
                  hover:opacity-90 hover:scale-[1.02] active:scale-95 transition-all
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                    style={{ boxShadow: "0 8px 20px rgba(128, 58, 209, 0.25)" }}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="inline mr-2 w-4 h-4 animate-spin" />
                                            Sending...
                                        </>
                                    ) : cooldown > 0 ? (
                                        <>
                                            <RefreshCw className="inline mr-2 w-4 h-4" />
                                            Resend in {formatCountdown(cooldown)}
                                        </>
                                    ) : (
                                        <>
                                            <RefreshCw className="inline mr-2 w-4 h-4" />
                                            Resend Verification Email
                                        </>
                                    )}
                                </button>

                                {cooldown > 0 && (
                                    <p className="mt-2 text-center text-xs text-[#475569] dark:text-[#94A3B8]">
                                        You can request another verification email in {formatCountdown(cooldown)}.
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
