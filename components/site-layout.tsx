"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import Link from "next/link"
import ConnectWallet from "@/components/connect-wallet"
import { MainFooter } from "@/components/main-footer"

interface SiteLayoutProps {
  children: React.ReactNode
}

export function SiteLayout({ children }: SiteLayoutProps) {
  const pathname = usePathname()

  const navItems = [
    { label: "Projects", href: "/projects" },
    { label: "Stake", href: "/stake" },
    { label: "Vote", href: "/vote" },
    { label: "Create", href: "/create" },
    { label: "Achievements", href: "/achievements" },
    { label: "About", href: "/about" },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-border/40 bg-background/80 backdrop-blur-lg">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <span className="bg-web3-gradient bg-clip-text text-transparent">PublicFund</span>
          </Link>
          <nav className="flex items-center gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === item.href ? "text-foreground" : "text-foreground/80 hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <ConnectWallet />
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <MainFooter />
    </div>
  )
}

