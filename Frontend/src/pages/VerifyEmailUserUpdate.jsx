import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { useDispatch } from "react-redux";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import AuthService from "../services/authService.js";
import { Login } from "../context/Thunk/Auth.js";

const verificationRequestCache = new Map();

const VerifyEmailUserUpdate = () => {
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [message, setMessage] = useState("Verifying your email...");
    const token = searchParams.get("token");
    const dispatch = useDispatch();

    useEffect(() => {
        let isActive = true;

        const verify = async () => {
            if (!token) {
                if (!isActive) return;
                setLoading(false);
                setSuccess(false);
                setMessage("Invalid or missing verification token.");
                return;
            }

            try {
                if (!verificationRequestCache.has(token)) {
                    verificationRequestCache.set(token, AuthService.verifyEmail(token));
                }

                const response = await verificationRequestCache.get(token);
                if (!isActive) return;

                if (response.success) {
                    setMessage(response.message || "Email verified successfully.");
                    setSuccess(true);
                    setTimeout(() => {
                        dispatch(Login(response.data));
                    }, 1500);
                } else {
                    setSuccess(false);
                    setMessage(response?.message || "Email verification failed.");
                }
            } catch {
                if (!isActive) return;
                setSuccess(false);
                setMessage("Something went wrong while verifying email.");
            } finally {
                if (isActive) {
                    setLoading(false);
                }
            }
        };

        verify();

        return () => {
            isActive = false;
        };
    }, [token, dispatch]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-[#141415] px-4">
            <div className="w-full max-w-md rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-[#19191b] p-8 shadow-xs text-center">
                <div className="mb-5 flex justify-center">
                    {loading ? (
                        <Loader2 className="w-10 h-10 animate-spin text-[#fe3e91]" />
                    ) : success ? (
                        <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                        <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                    )}
                </div>

                <h1 className="text-xl font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                    {loading ? "Verifying email" : success ? "Email verified" : "Verification failed"}
                </h1>

                <p className="text-xs text-zinc-600 dark:text-zinc-400">{message}</p>
            </div>
        </div>
    );
};

export default VerifyEmailUserUpdate;
