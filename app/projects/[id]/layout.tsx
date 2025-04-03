"use client"
import { Toaster } from "@/components/ui/toaster"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import {WalletAdapterNetwork} from "@solana/wallet-adapter-base"
import React, {FC, useMemo } from "react"
import { PhantomWalletAdapter, UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from "@solana/web3.js"
import { WalletAuthProvider } from "@/components/wallet-auth-provider"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
        <ConnectionProvider endpoint={clusterApiUrl(WalletAdapterNetwork.Devnet)}>
            <WalletProvider wallets={[new PhantomWalletAdapter()]} autoConnect>
                {children}
                <Toaster />
            </WalletProvider>
        </ConnectionProvider>
  )
}