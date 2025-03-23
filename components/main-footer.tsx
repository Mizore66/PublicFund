import Link from "next/link"

export function MainFooter() {
  return (
    <footer className="border-t border-border/40 py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-foreground/60 md:text-left">
          © 2025 <span className="bg-web3-gradient bg-clip-text text-transparent font-medium">PublicFund</span>. All
          rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="/terms"
            className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
          >
            Terms
          </Link>
          <Link
            href="/privacy"
            className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
          >
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  )
}

