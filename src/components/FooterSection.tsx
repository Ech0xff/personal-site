export default function FooterSection() {
  return (
    <footer className="w-full mt-12 pb-8 flex flex-col items-center justify-center gap-6">
      <div className="w-full max-w-2xl px-4 mx-auto">
        <div className="w-full h-px bg-linear-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />
      </div>

      <div className="flex flex-col items-center gap-2 text-sm text-slate-400 dark:text-slate-500 font-mono">
        <p>© {new Date().getFullYear()} BBLF. All rights reserved.</p>
        <div className="flex items-center gap-3 text-xs opacity-70">
          <span className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-default">
            Designed by BBLF
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
          <span className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-default">
            Built with Next.js
          </span>
        </div>
      </div>
    </footer>
  );
}
