import { UserRound } from "lucide-react";
import { GRADIENT_SHARED } from "../../../constants/style";

const InfoRow = ({ label, value }) => (
  <div className="rounded-xl border border-zinc-200/80 bg-white/80 px-4 py-3 dark:border-zinc-700/80 dark:bg-zinc-800/60">
    <p className="text-xs font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
      {label}
    </p>
    <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{value}</p>
  </div>
);

const ProfileTab = ({ user }) => {
  const providers = Array.isArray(user?.auth_service) ? user.auth_service : [];
  const isGoogleConnected = providers.some((item) => item?.auth_provider === "GOOGLE");
  const isLinkedInConnected = providers.some((item) => item?.auth_provider === "LINKEDIN");

  const joinedAt = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not available";

  return (
    <>
      <div className="mb-7 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-medium tracking-tight text-zinc-900 sm:text-2xl dark:text-zinc-100">
            Profile details
          </h1>
          <p className="mt-1 text-xs text-zinc-500">
            View your account information and credentials.
          </p>
        </div>
        <span className="rounded-lg bg-zinc-100 p-2.5 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          <UserRound size={18} />
        </span>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <InfoRow label="Name" value={user?.name || "Not available"} />
        <InfoRow label="Email" value={user?.email || "Not available"} />
        <InfoRow label="Email Verification" value={user?.email_verified ? "Verified" : "Not Verified"} />
        <InfoRow label="Member Since" value={joinedAt} />
      </div>

      <div className="mt-6 rounded-2xl border border-zinc-200/80 bg-white/80 p-4 sm:p-5 dark:border-zinc-700/80 dark:bg-zinc-800/55">
        <h3 className="text-base font-bold text-zinc-900 dark:text-white">Connected Accounts</h3>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
          Social account connection status.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900/60">
            <div>
              <p className="text-sm font-bold text-zinc-900 dark:text-white">Google</p>
              <p className="text-xs text-zinc-600 dark:text-zinc-300">
                {isGoogleConnected ? "Connected" : "Not connected"}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900/60">
            <div>
              <p className="text-sm font-bold text-zinc-900 dark:text-white">LinkedIn</p>
              <p className="text-xs text-zinc-600 dark:text-zinc-300">
                {isLinkedInConnected ? "Connected" : "Not connected"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileTab;
