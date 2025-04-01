"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserProfile } from "@/context/auth-context"
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react"
import { Connection, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { ArrowUpRight, Check, CircleDollarSign, CoinsIcon as CoinIcon, Coins, DollarSign, ExternalLink, History, Minus, Plus, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"
import {PROGRAM_ID, STAKE_VAULT, STAKE_VAULT_AUTHORITY, STAKE_REWARD_TOKEN, getUserVaultAccount} from "../anchor/lib/addresses"
import { toast } from "sonner"
import IDL from "../anchor/lib/idl.json";
import {Stake} from "../anchor/lib/stake";
import * as anchor from "@coral-xyz/anchor";
import { SiteLayout } from "./site-layout"
import { Input } from "./ui/input"
import StakeProgramClaim from "./stake-program-claim"
import StakeProgramWithdraw from "./stake-program-withdraw"
import StakeProgramDeposit from "./stake-program-deposit"


const connection = new Connection(clusterApiUrl("devnet"), "confirmed")

export function TokenBalance(user : UserProfile | null) {
  const fullAddress = user?.walletAddress
  const {publicKey, connected, signTransaction} = useWallet();
  console.log("Public Key:", publicKey);
  // console.log( "Money:", connection.getBalance(publicKey))
  console.log("Connected:", connected);
  // const publicKey = user?.walletAddress ? new PublicKey(user.walletAddress) : null
  const anchorWallet = useAnchorWallet();
  console.log("Anchor Wallet:", anchorWallet);
  const [walletBalance, setWalletBalance] = useState<number | null>(null)
  const [totalStaked, setTotalStaked] = useState<number | null>(null);
  const [stakedAmount, setStakedAmount] = useState<number | null>(null);
  const [rewardTokenBalance, setRewardTokenBalance] = useState<number | null>(null);

  // useEffect(() => {
  //   const fetchWalletBalance = async () => {
  //     if (user?.walletAddress) {
  //       try {
  //         const publicKey = new PublicKey(user.walletAddress)
  //         const balance = await connection.getBalance(publicKey)
  //         setWalletBalance(balance / 1e9) // Convert lamports to SOL
  //       } catch (error) {
  //         console.error("Error fetching wallet balance:", error)
  //         setWalletBalance(null)
  //       }
  //     }
  //   }

  //   fetchWalletBalance()
  // }, [user?.walletAddress])

  // Refresh balances periodically and after component mounts
  useEffect(() => {
    if (connected) {
        const fetchBalances = async () => {
            await fetchSolanaBalance();
            await fetchStakedBalance();
            await fetchRewardTokenBalance();
            await fetchTotalStaked();
        };
        
        fetchBalances();
        
        // Set up interval to refresh balances every 60 seconds
        const interval = setInterval(fetchBalances, 60000);
        
        return () => clearInterval(interval);
    }
}, [connected, publicKey]);

  // Fetch Protocol's Total Staked SOL
  const fetchTotalStaked = async ()=>{
      try {
          const stakeVaultAuthority = await connection.getAccountInfo(STAKE_VAULT_AUTHORITY);
          if (stakeVaultAuthority) {
              const totalStaked = stakeVaultAuthority.lamports / LAMPORTS_PER_SOL;
              setTotalStaked(totalStaked);
          } else {
              console.error("Stake Vault account not found");
              toast.error("Failed to fetch total staked SOL");
          }
      } catch (error) {
          console.error("Error fetching total staked SOL:", error);
          toast.error("Failed to fetch total staked SOL");
      }
  }
  
  // Fetch User's Solana Balance
  const fetchSolanaBalance = async () => {
      if (publicKey) {
          try {
              const balance = await connection.getBalance(publicKey);
              console.log("User's Solana Balance:", balance);
              setWalletBalance(balance / LAMPORTS_PER_SOL);
          } catch (error) {
              console.error("Error fetching Solana balance:", error);
              toast.error("Failed to fetch Solana balance");
          }
      }
  }

  // Fetch User's Staked Amount in the Smart Contract
  const fetchStakedBalance = async () => {
      if (anchorWallet && publicKey) {
          const userVaultAccount = getUserVaultAccount(publicKey);
          
          try {
              const provider = new anchor.AnchorProvider(connection, anchorWallet, anchor.AnchorProvider.defaultOptions())
              const program = new anchor.Program(IDL as Stake, provider);
              
              try {
                  // @ts-ignore - userAccount exists in the IDL
                  const userVaultAccountData = await program.account.userAccount.fetch(userVaultAccount);
                  setStakedAmount(userVaultAccountData.stakeAmount / LAMPORTS_PER_SOL);
                  console.log("User Vault Account:", userVaultAccountData);
              } catch (error) {
                  console.log("User hasn't staked yet");
                  setStakedAmount(0);
              }
          } catch (error) {
              console.error("Error fetching user vault account:", error);
              toast.error("Failed to fetch staked balance");
          }
      }
  }
  
  // Fetch User's Reward Token Balance
  const fetchRewardTokenBalance = async () => {
      if (anchorWallet && publicKey) {
          try {
              // Get the associated token account for the reward token
              const { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } = await import('@solana/spl-token');
              const userStakeRewardTokenAccount = await getAssociatedTokenAddress(
                  STAKE_REWARD_TOKEN,
                  publicKey
              );
              
              try {
                  const tokenAccountInfo = await connection.getTokenAccountBalance(userStakeRewardTokenAccount);
                  setRewardTokenBalance(tokenAccountInfo.value.uiAmount);
              } catch (error) {
                  console.log("User doesn't have reward tokens yet");
                  setRewardTokenBalance(0);
              }
          } catch (error) {
              console.error("Error fetching reward token balance:", error);
              toast.error("Failed to fetch reward token balance");
          }
      }
  }
  const [depositAmount, setDepositAmount] = useState("0.1")
  const [withdrawAmount, setWithdrawAmount] = useState("0.05")

  // Mock data for the staking dashboard
  const stakingData = {
    totalProtocolStaked: totalStaked ? totalStaked : 0,
    solanaBalance: walletBalance ? walletBalance : 0,
    stakedAmount: stakedAmount ? stakedAmount : 0,
    rewardTokens: rewardTokenBalance ? rewardTokenBalance : 0,
    timeElapsed: 17274, // seconds
    estimatedRewards: 8.64,
  }

  // Shortened wallet address for display
  // Mock data for token balances
  const tokenData = {
    fund: {
      balance: rewardTokenBalance ? rewardTokenBalance : 0,
      staked: 500,
      available: 750.75,
      history: [
        { date: "2025-03-15", amount: 50, type: "Earned", description: "Staking Rewards" },
        { date: "2025-03-10", amount: -25, type: "Spent", description: "Donation to Education for All" },
        { date: "2025-03-05", amount: 100, type: "Earned", description: "Staking Rewards" },
        { date: "2025-03-01", amount: -50, type: "Spent", description: "Donation to Clean Water Initiative" },
      ],
    },
    sol: {
      balance: walletBalance ? walletBalance : 0,
      staked: stakedAmount ? stakedAmount : 0,
      available: walletBalance ? walletBalance - (stakedAmount ? stakedAmount : 0) : 0,
      history: [
        { date: "2025-03-12", amount: -5, type: "Staked", description: "Staked SOL for 90 days" },
        { date: "2025-03-08", amount: 2, type: "Received", description: "Deposit from Exchange" },
        { date: "2025-03-03", amount: -3.25, type: "Staked", description: "Staked SOL for 30 days" },
        { date: "2025-02-25", amount: 15, type: "Received", description: "Initial Deposit" },
      ],
    },
  }

  // "use client"

// import { useState } from "react"
// import { SiteLayout } from "@/components/site-layout"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { ExternalLink, Check, Plus, Minus, DollarSign, CircleDollarSign, Coins } from "lucide-react"
// import { useAuth } from "@/context/auth-context"

// export default function StakingDashboardPage() {
//   const { user } = useAuth()
//   const [depositAmount, setDepositAmount] = useState("0.1")
//   const [withdrawAmount, setWithdrawAmount] = useState("0.05")

//   // Mock data for the staking dashboard
//   const stakingData = {
//     totalProtocolStaked: 0.9,
//     solanaBalance: 3.4959,
//     stakedAmount: 0.5,
//     rewardTokens: 15.254,
//     timeElapsed: 17274, // seconds
//     estimatedRewards: 8.64,
//   }

//   // Shortened wallet address for display
//   const shortenedAddress = user?.walletAddress
//     ? `${user.walletAddress.substring(0, 6)}...${user.walletAddress.substring(user.walletAddress.length - 4)}`
//     : "EGn97R6FkiA9HGRQ...PC6XcCR"

//   const fullAddress = user?.walletAddress || "EGn97R6FkiA9HGRQzrrpL2w7XWY1icmUvHbtYPC6XcCR"

  return (
      <div className="container py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Wallet Address Card */}
          <Card className="web3-card p-4 flex flex-col items-center justify-center space-y-4">
            <div className="bg-muted/50 rounded-lg px-4 py-3 w-full text-center font-mono text-sm">{fullAddress}</div>
            <Button
              variant="default"
              className="web3-button flex items-center gap-2"
              onClick={() => window.open(`https://explorer.solana.com/address/${fullAddress}`, "_blank")}
            >
              <ExternalLink className="h-4 w-4" />
              View on Explorer
            </Button>
          </Card>

          {/* Total Protocol Staked */}
          <Card className="web3-card p-6 flex flex-col items-center justify-center space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                <CircleDollarSign className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Total Protocol Staked:</h2>
            </div>
            <p className="text-4xl font-bold bg-web3-gradient bg-clip-text text-transparent">
              {stakingData.totalProtocolStaked.toFixed(4)} SOL
            </p>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Solana Balance */}
            <Card className="web3-card p-6 flex flex-col items-center justify-center space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20">
                  <CircleDollarSign className="h-5 w-5 text-blue-500" />
                </div>
                <h3 className="text-lg font-medium">Solana Balance</h3>
              </div>
              <p className="text-3xl font-bold">{stakingData.solanaBalance.toFixed(4)} SOL</p>
            </Card>

            {/* Staked Amount */}
            <Card className="web3-card p-6 flex flex-col items-center justify-center space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/20">
                  <DollarSign className="h-5 w-5 text-purple-500" />
                </div>
                <h3 className="text-lg font-medium">Staked Amount</h3>
              </div>
              <p className="text-3xl font-bold">{stakingData.stakedAmount.toFixed(4)} SOL</p>
            </Card>

            {/* Reward Tokens */}
            <Card className="web3-card p-6 flex flex-col items-center justify-center space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-500/20">
                  <Coins className="h-5 w-5 text-pink-500" />
                </div>
                <h3 className="text-lg font-medium">Reward Tokens</h3>
              </div>
              <p className="text-3xl font-bold">{stakingData.rewardTokens.toFixed(4)}</p>
            </Card>
          </div>

          {/* Action Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Deposit SOL */}
            <StakeProgramDeposit/>

            {/* Withdraw SOL */}
            <StakeProgramWithdraw/>

            {/* Claim Rewards */}
            <StakeProgramClaim/>
          </div>
        </div>
      </div>
  )
}

