import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { useDispatch } from "react-redux";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import AuthService from "../services/authService.js";
import { setLogin } from "../context/authSlice";

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
                    console.log("Email verification successful, updating user data in store:", response);
                    setMessage(response.message || "Email verified successfully.");
                    setSuccess(true);
                    setTimeout(() => {
                        dispatch(setLogin(response.data));
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
                if (!isActive) return;
                setLoading(false);
            }
        };

        verify();

        return () => {
            isActive = false;
        };
    }, [token]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FFFFFF] dark:bg-[#111827] px-4">
            <div className="w-full max-w-md rounded-2xl border border-[#E5E7EB] dark:border-[#374151] bg-[#FFFFFF] dark:bg-[#1F2937] p-8 shadow-xl text-center">
                <div className="mb-6 flex justify-center">
                    {loading ? (
                        <Loader2 className="w-12 h-12 animate-spin text-[#803AD1] dark:text-[#9D65D5]" />
                    ) : success ? (
                        <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
                    ) : (
                        <XCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
                    )}
                </div>

                <h1 className="text-2xl font-bold text-[#1E293B] dark:text-white mb-2">
                    {loading ? "Verifying Email" : success ? "Email Verified" : "Verification Failed"}
                </h1>

                <p className="text-sm text-[#475569] dark:text-[#94A3B8]">{message}</p>
            </div>
        </div>
    );
};

export default VerifyEmailUserUpdate;
