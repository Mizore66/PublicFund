import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SafeContextProvider } from "@/context/safe-context-provider"
import { Toaster } from "@/components/ui/toaster"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import {WalletAdapterNetwork} from "@solana/wallet-adapter-base"
import React, {FC, useMemo } from "react"
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from "@solana/web3.js"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PublicFund - Web3 Quadratic Funding",
  description: "Support public goods with quadratic funding on the blockchain",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <html lang="en" className="dark">
      <head>
        {/* Add Phantom wallet detection */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.phantom = window.phantom || {};
            window.phantom.solana = window.phantom.solana || {};
          `,
          }}
        />
      </head>
      <body className={`${inter.className} min-h-screen bg-background web3-grid-bg`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <SafeContextProvider>
            {children}
            <Toaster />
          </SafeContextProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'