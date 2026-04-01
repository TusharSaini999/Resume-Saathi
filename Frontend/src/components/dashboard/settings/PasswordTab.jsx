import { Loader2, ShieldCheck } from "lucide-react";
import { BUTTON_CLASS } from "../../../constants/style";

const PasswordTab = ({
  currentPassword,
  newPassword,
  confirmPassword,
  isChangingPassword,
  onCurrentPasswordChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
}) => {
  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">Change Password</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Update your password to keep your account secure.
          </p>
        </div>
        <span className="rounded-xl bg-violet-100 p-3 text-violet-600 dark:bg-violet-500/20 dark:text-violet-300">
          <ShieldCheck size={20} />
        </span>
      </div>

      <form onSubmit={onSubmit} className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 sm:p-5 dark:border-slate-700/80 dark:bg-slate-800/50">
        <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
          <div className="space-y-3">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Current Password</span>
              <input
                type="password"
                value={currentPassword}
                onChange={(event) => onCurrentPasswordChange(event.target.value)}
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-pink-300 transition focus:ring-2 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                placeholder="Enter current password"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">New Password</span>
              <input
                type="password"
                value={newPassword}
                onChange={(event) => onNewPasswordChange(event.target.value)}
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-pink-300 transition focus:ring-2 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                placeholder="Minimum 8 characters"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Confirm New Password</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => onConfirmPasswordChange(event.target.value)}
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-pink-300 transition focus:ring-2 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                placeholder="Re-enter new password"
              />
            </label>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-slate-50/85 p-3.5 dark:border-slate-700/80 dark:bg-slate-900/55">
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Password Rules</p>
            <ul className="mt-2.5 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <li>Minimum 8 characters</li>
              <li>Use letters and numbers</li>
              <li>Avoid reusing old passwords</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={isChangingPassword}
            className={`inline-flex min-w-44 items-center justify-center ${BUTTON_CLASS} hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70`}
          >
            {isChangingPassword ? <Loader2 className="animate-spin" size={18} /> : "Update Password"}
          </button>
        </div>
      </form>
    </>
  );
};

export default PasswordTab;
