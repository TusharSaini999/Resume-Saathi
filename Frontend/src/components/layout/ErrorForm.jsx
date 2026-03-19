import { AlertCircle } from "lucide-react";
const ErrorForm = ({error=null}) => {
    return (
        <>
            {error && (
                <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>{error}</p>
                </div>
            )}
        </>
    )
}

export default ErrorForm;