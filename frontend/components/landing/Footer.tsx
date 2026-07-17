import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-hairline px-6 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded-md bg-paper text-ink font-display text-xs font-semibold">
            A
          </span>
          <span className="text-sm text-mist">Auxilium © 2026</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-mist">
          <Link href="/dashboard" className="hover:text-paper transition-colors">
            Dashboard
          </Link>
          <a href="#" className="hover:text-paper transition-colors">
            Documentation
          </a>
          <a href="#" className="hover:text-paper transition-colors">
            Security
          </a>
        </div>
      </div>
    </footer>
  );
}
