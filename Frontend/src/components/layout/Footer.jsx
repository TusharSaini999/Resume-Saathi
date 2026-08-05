function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-[#E5E7EB] dark:border-[#374151] bg-white dark:bg-[#111827]">
            <div className="max-w-7xl mx-auto px-6 py-5">
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row w-full">
                    <div className="text-sm font-bold text-[#1E293B] dark:text-white flex-1 text-center sm:text-left">
                        Resume Saathi
                    </div>

                    <div className="text-xs text-[#94A3B8] flex-1 text-center font-medium">
                        Crafted with ❤️ by Tushar Saini
                    </div>

                    <div className="text-xs text-[#94A3B8] flex-1 text-center sm:text-right">
                        Copyright {currentYear} Resume Saathi. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
}
export default Footer;