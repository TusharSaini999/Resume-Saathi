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
          <h2 className="text-xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl">Change password</h2>
          <p className="mt-1 text-xs text-zinc-500">
            Update your password to keep your account secure.
          </p>
        </div>
        <span className="rounded-lg bg-zinc-100 p-2 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          <ShieldCheck size={18} />
        </span>
      </div>

      <form onSubmit={onSubmit} className="rounded-xl border border-zinc-200/80 bg-white p-4 sm:p-5 dark:border-zinc-800 dark:bg-[#19191b]">
        <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
          <div className="space-y-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Current password</span>
              <input
                type="password"
                value={currentPassword}
                onChange={(event) => onCurrentPasswordChange(event.target.value)}
                className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 outline-none transition focus:border-[#fe3e91] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                placeholder="Enter current password"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">New password</span>
              <input
                type="password"
                value={newPassword}
                onChange={(event) => onNewPasswordChange(event.target.value)}
                className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 outline-none transition focus:border-[#fe3e91] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                placeholder="Minimum 8 characters"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Confirm new password</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => onConfirmPasswordChange(event.target.value)}
                className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 outline-none transition focus:border-[#fe3e91] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                placeholder="Re-enter new password"
              />
            </label>
          </div>

          <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/85 p-3.5 dark:border-zinc-700/80 dark:bg-zinc-900/55">
            <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100">Password Rules</p>
            <ul className="mt-2.5 space-y-1.5 text-xs text-zinc-600 dark:text-zinc-300">
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
