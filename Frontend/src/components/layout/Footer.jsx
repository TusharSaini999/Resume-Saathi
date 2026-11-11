function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-200/80 bg-white dark:border-zinc-800/80 dark:bg-[#141415]">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row text-xs text-zinc-500 dark:text-zinc-500">
          <div className="font-medium text-zinc-900 dark:text-zinc-200">
            Resume Saathi
          </div>

          <div>
            Built with craft for transparent career recruitment
          </div>

          <div>
            &copy; {currentYear} Resume Saathi
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
