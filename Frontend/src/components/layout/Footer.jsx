function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-[#E5E7EB] dark:border-[#374151] bg-white dark:bg-[#111827]">
            <div className="max-w-7xl mx-auto px-6 py-5">
                <div className="flex flex-col items-center justify-between gap-2 text-center sm:flex-row sm:text-left">
                    <div className="text-sm font-bold text-[#1E293B] dark:text-white">
                        Resume Saathi
                    </div>

                    <div className="text-xs text-[#94A3B8]">
                        Copyright {currentYear} Resume Saathi. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
}
export default Footer;