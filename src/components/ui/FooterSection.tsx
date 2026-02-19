export default function FooterSection() {
  return (
    <footer className="mt-auto flex w-full flex-col items-center justify-center gap-6 pb-8">
      <div className="mx-auto w-full max-w-2xl px-4">
        <div className="h-px w-full bg-linear-to-r from-transparent via-slate-200 to-transparent dark:via-slate-800" />
      </div>

      <div className="flex flex-col items-center gap-2 font-mono text-sm text-slate-400 dark:text-slate-500">
        <p>© {new Date().getFullYear()} BBLF. All rights reserved.</p>
        <div className="flex items-center gap-3 text-xs opacity-70">
          <span className="cursor-default transition-colors hover:text-slate-600 dark:hover:text-slate-300">
            Designed by BBLF
          </span>
          <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
          <span className="cursor-default transition-colors hover:text-slate-600 dark:hover:text-slate-300">
            Built with Next.js
          </span>
        </div>
      </div>
    </footer>
  );
}
