import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { KeyRound, Monitor, UserRound } from "lucide-react";
import AuthService from "../services/authService.js";
import { setError, setSuccess } from "../context/messageSlice.js";
import { Logout as LogoutThunk } from "../context/Thunk/Auth.js";
import SettingsSidebar from "../components/dashboard/settings/SettingsSidebar.jsx";
import ProfileTab from "../components/dashboard/settings/ProfileTab.jsx";
import PasswordTab from "../components/dashboard/settings/PasswordTab.jsx";
import SessionsTab from "../components/dashboard/settings/SessionsTab.jsx";

const tabItems = [
  { key: "profile", label: "Profile", icon: UserRound },
  { key: "password", label: "Change Password", icon: KeyRound },
  { key: "sessions", label: "Session Management", icon: Monitor },
];

const Settings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [activeTab, setActiveTab] = useState("profile");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [sessions, setSessions] = useState([]);
  const [isSessionsLoading, setIsSessionsLoading] = useState(false);
  const [isLogoutAllLoading, setIsLogoutAllLoading] = useState(false);
  const [killingSessionId, setKillingSessionId] = useState("");

  const currentToken = user?.token;
  const mappedSessions = useMemo(
    () =>
      sessions.map((session) => ({
        ...session,
        isCurrent: Boolean(currentToken && session.token === currentToken),
      })),
    [sessions, currentToken]
  );

  const loadSessions = async () => {
    setIsSessionsLoading(true);
    try {
      const response = await AuthService.getSessions();
      if (response?.success) {
        setSessions(Array.isArray(response.data) ? response.data : []);
      } else {
        dispatch(setError(response?.message || "Unable to load sessions."));
      }
    } catch {
      dispatch(setError("Something went wrong while loading sessions."));
    } finally {
      setIsSessionsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "sessions") {
      loadSessions();
    }
  }, [activeTab]);

  const handleChangePassword = async (event) => {
    event.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      dispatch(setError("All password fields are required."));
      return;
    }

    if (newPassword.length < 8) {
      dispatch(setError("New password must be at least 8 characters."));
      return;
    }

    if (newPassword !== confirmPassword) {
      dispatch(setError("New password and confirm password do not match."));
      return;
    }

    setIsChangingPassword(true);
    try {
      const response = await AuthService.changePassword(currentPassword, newPassword);
      if (response?.success) {
        dispatch(setSuccess(response.message || "Password changed successfully."));
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        dispatch(setError(response?.message || "Unable to change password."));
      }
    } catch {
      dispatch(setError("Something went wrong while changing password."));
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleKillSession = async (sessionId, isCurrent) => {
    if (!sessionId || killingSessionId) return;

    setKillingSessionId(sessionId);
    try {
      const response = await AuthService.killSession(sessionId);
      if (response?.success) {
        dispatch(setSuccess("Session logged out successfully."));
        if (isCurrent) {
          dispatch(LogoutThunk());
          navigate("/auth/login", { replace: true });
          return;
        }
        loadSessions();
      } else {
        dispatch(setError(response?.message || "Unable to remove session."));
      }
    } catch {
      dispatch(setError("Something went wrong while removing session."));
    } finally {
      setKillingSessionId("");
    }
  };

  const handleLogoutAll = async () => {
    if (isLogoutAllLoading) return;

    setIsLogoutAllLoading(true);
    try {
      const response = await AuthService.logoutAll();
      if (response?.success) {
        dispatch(setSuccess(response.message || "All sessions logged out successfully."));
        dispatch(LogoutThunk());
        navigate("/auth/login", { replace: true });
      } else {
        dispatch(setError(response?.message || "Unable to logout all sessions."));
      }
    } catch {
      dispatch(setError("Something went wrong while logging out all sessions."));
    } finally {
      setIsLogoutAllLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-linear-to-br from-[#f8fafc] via-[#f5f3ff] to-[#eef2ff] px-4 pb-14 pt-24 sm:px-6 lg:px-8 dark:from-[#111827] dark:via-[#0f172a] dark:to-[#1f2937]">
      <div className="relative mx-auto grid w-full max-w-7xl items-stretch gap-6 xl:gap-8 lg:h-[calc(100vh-8.5rem)] lg:grid-cols-[320px_1fr]">
        <SettingsSidebar tabItems={tabItems} activeTab={activeTab} onTabChange={setActiveTab} />

        <section className="rounded-3xl border border-slate-200/70 bg-white/85 shadow-[0_20px_70px_-30px_rgba(128,58,209,0.45)] backdrop-blur-md lg:h-full lg:overflow-x-hidden lg:overflow-y-auto dark:border-slate-700/80 dark:bg-slate-900/85">
          <div className="h-full overflow-y-auto p-5 [scrollbar-width:none] sm:p-7 lg:p-8 [&::-webkit-scrollbar]:hidden">
            {activeTab === "profile" && <ProfileTab user={user} />}

            {activeTab === "password" && (
              <PasswordTab
                currentPassword={currentPassword}
                newPassword={newPassword}
                confirmPassword={confirmPassword}
                isChangingPassword={isChangingPassword}
                onCurrentPasswordChange={setCurrentPassword}
                onNewPasswordChange={setNewPassword}
                onConfirmPasswordChange={setConfirmPassword}
                onSubmit={handleChangePassword}
              />
            )}

            {activeTab === "sessions" && (
              <SessionsTab
                sessions={mappedSessions}
                isSessionsLoading={isSessionsLoading}
                isLogoutAllLoading={isLogoutAllLoading}
                killingSessionId={killingSessionId}
                onLogoutAll={handleLogoutAll}
                onKillSession={handleKillSession}
                onRefresh={loadSessions}
              />
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
