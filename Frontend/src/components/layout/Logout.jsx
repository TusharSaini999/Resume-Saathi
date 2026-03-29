import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import AuthService from "../../services/authService.js";
import { setError, setSuccess } from "../../context/messageSlice.js";
import { Logout as LogoutThunk } from "../../context/Thunk/Auth.js";
function Logout({style = ""}) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const res = await AuthService.logout();
            if (res.success) {
                dispatch(setSuccess(res.message || "Logged out successfully."));
                dispatch(LogoutThunk());
                setTimeout(() => {
                    navigate("/auth/login");
                }, 1500);
            } else {
                dispatch(setError("Failed to log out. Please try again."));
            }
        } catch {
            dispatch(setError("An error occurred during logout. Please try again."));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleLogout}
            disabled={isLoading}
            className={`${style} ${isLoading ? "cursor-not-allowed opacity-80" : ""}`}
            title="Logout"
        >
            {isLoading ? (
                <span className="inline-flex items-center gap-2">
                    Logging out...
                </span>
            ) : (
                "Logout"
            )}
        </button>
    )
}
export default Logout;