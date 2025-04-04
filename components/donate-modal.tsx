"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2, AlertCircle } from "lucide-react"
import { useWalletAuth } from "@/context/wallet-auth-context"
import { makeDonation } from "@/lib/actions"
import { useToast } from "@/components/ui/use-toast"
import { ConnectionProvider, useAnchorWallet, useWallet, WalletProvider } from "@solana/wallet-adapter-react"
import { clusterApiUrl, Connection, Keypair, ParsedAccountData, PublicKey, sendAndConfirmTransaction, Transaction } from "@solana/web3.js"
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { useAuth } from "@/context/auth-context"
import { createTransferInstruction, getOrCreateAssociatedTokenAccount } from "@solana/spl-token"
import bs58 from 'bs58';
import { send } from "process"
import { STAKE_REWARD_TOKEN } from "@/anchor/lib/addresses"


interface DonateModalProps {
  open: boolean
  onClose: () => void
  projectId: string
  projectTitle: string
  projectOwnerWallet: string
}

if (!process.env.NEXT_PUBLIC_PRIV_KEY) {
  throw new Error("Environment variable PRIV_KEY is not defined.");
}
const b = bs58.decode(process.env.NEXT_PUBLIC_PRIV_KEY); // Replace with your base58 encoded private key
const j = new Uint8Array(b.buffer, b.byteOffset, b.byteLength / Uint8Array.BYTES_PER_ELEMENT); 

export function DonateModal({ open, onClose, projectId, projectTitle, projectOwnerWallet }: DonateModalProps) {
  const MINT_ADDRESS = "GX9pa1cSpFXtwdEByqQrHAFv6KcFD56n2X2WvuTpd2ZB"; // Replace with your token mint address
  const RECIPIENT_ADDRESS = projectOwnerWallet; // Replace with the recipient's wallet address
  console.log(`Recipient Address: ${RECIPIENT_ADDRESS}`);
  const FROM_KEYPAIR = Keypair.fromSecretKey(j); // Replace with your keypair
  const SOLANA_CONNECTION = new Connection("https://api.devnet.solana.com"); // Replace with your RPC URL
  const {publicKey} = useWallet()
  const anchorWallet = useAnchorWallet()
  const { user, status } = useAuth()
  const { toast } = useToast()
  const [amount, setAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rewardTokenBalance, setRewardTokenBalance] = useState<number>(0)

  useEffect(() => {
    if (open) {
      fetchRewardTokenBalance()
    }
  }, [open, publicKey])

  const handleDonate = async () => {
    // Validate amount
    if (!amount || Number.parseFloat(amount) <= 0) {
      setError("Please enter a valid donation amount")
      return
    }

    // Check if user is authenticated
    if (!publicKey) {
      setError("Please connect your wallet to donate")
      return
    }

    // Check if user is KYC verified
    if (status !== "kyc-verified") {
      setError("You need to complete KYC verification to donate")
      return
    }

    setError(null)
    setIsProcessing(true)

    try {
      await sendTokens()
      // For now, we'll use our server action to record the donation
      await makeDonation({
        projectId,
        amount: Number.parseFloat(amount),
        walletAddress: publicKey?.toString() || "",
      })

      setIsProcessing(false)
      setIsSuccess(true)

      // Reset and close after showing success
      setTimeout(() => {
        setIsSuccess(false)
        setAmount("")
        onClose()
      }, 2000)
    } catch (error) {
      console.error("Error making donation:", error)
      setIsProcessing(false)
      setError("Failed to process donation. Please try again.")
    }
  }

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
                  const tokenAccountInfo = await SOLANA_CONNECTION.getTokenAccountBalance(userStakeRewardTokenAccount);
                  setRewardTokenBalance(tokenAccountInfo.value.uiAmount ?? 0);
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

  async function getNumberDecimals(mintAddress: string):Promise<number> {
    const info = await SOLANA_CONNECTION.getParsedAccountInfo(new PublicKey(mintAddress));
    const result = (info.value?.data as ParsedAccountData).parsed.info.decimals as number;
    return result;
    }

  async function sendTokens() {
      const TRANSFER_AMOUNT = Number.parseFloat(amount)
      console.log(`Sending ${TRANSFER_AMOUNT} ${(MINT_ADDRESS)} from ${(publicKey?.toString())} to ${(RECIPIENT_ADDRESS)}.`)
      if (publicKey) {
      {
        console.log(`Sending ${TRANSFER_AMOUNT} ${(MINT_ADDRESS)} from ${(publicKey.toString())} to ${(RECIPIENT_ADDRESS)}.`)
        //Step 1
        console.log(`1 - Getting Source Token Account`);
        let sourceAccount = await getOrCreateAssociatedTokenAccount(
            SOLANA_CONNECTION, 
            FROM_KEYPAIR,
            new PublicKey(MINT_ADDRESS),
            publicKey
        );
        console.log(`Source Account: ${sourceAccount.address.toString()}`);

        console.log(`2 - Getting Destination Token Account`);
        let destinationAccount = await getOrCreateAssociatedTokenAccount(
            SOLANA_CONNECTION, 
            FROM_KEYPAIR,
            new PublicKey(MINT_ADDRESS),
            new PublicKey(RECIPIENT_ADDRESS)
        );
        console.log(`    Destination Account: ${destinationAccount.address.toString()}`);

          //Step 3
        console.log(`3 - Fetching Number of Decimals for Mint: ${MINT_ADDRESS}`);
        const numberDecimals = await getNumberDecimals(MINT_ADDRESS);
        console.log(`    Number of Decimals: ${numberDecimals}`);

        console.log(`4 - Creating and Sending Transaction`);
        const tx = new Transaction();
        tx.add(createTransferInstruction(
            sourceAccount.address,
            destinationAccount.address,
            publicKey,
            TRANSFER_AMOUNT * Math.pow(10, numberDecimals)
        ))

          const latestBlockHash = await SOLANA_CONNECTION.getLatestBlockhash('confirmed');
          tx.recentBlockhash = await latestBlockHash.blockhash;    
          const signature = await sendAndConfirmTransaction(SOLANA_CONNECTION,tx,[FROM_KEYPAIR]);
          console.log(
              '\x1b[32m', //Green Text
              `   Transaction Success!🎉`,
              `\n    https://explorer.solana.com/tx/${signature}?cluster=devnet`
          );
      }

  }
}

  const presetAmounts = [5, 10, 25, 50, 100]

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent className="web3-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl bg-web3-gradient bg-clip-text text-transparent">
            Donate to {projectTitle}
          </DialogTitle>
          <DialogDescription className="text-foreground/70">
            Your donation will be matched according to the quadratic funding formula.
          </DialogDescription>
        </DialogHeader>
        {!isSuccess ? (
          <>
            <div className="grid gap-4 py-4">
              {!publicKey && (
                <div className="rounded-lg bg-yellow-500/10 p-4 border border-yellow-500/20 mb-2">
                  <h3 className="text-sm font-medium text-yellow-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Wallet Not Connected
                  </h3>
                  <p className="text-xs mt-1 text-foreground/70">Please connect your wallet to make a donation.</p>
                </div>
              )}

              {status !== "kyc-verified" && (
                <div className="rounded-lg bg-yellow-500/10 p-4 border border-yellow-500/20 mb-2">
                  <h3 className="text-sm font-medium text-yellow-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    KYC Verification Required
                  </h3>
                  <p className="text-xs mt-1 text-foreground/70">
                    Please complete KYC verification to make a donation.
                  </p>
                </div>
              )}

              {error && (
                <div className="rounded-lg bg-red-500/10 p-4 border border-red-500/20 mb-2">
                  <h3 className="text-sm font-medium text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Error
                  </h3>
                  <p className="text-xs mt-1 text-foreground/70">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-5 gap-2">
                {presetAmounts.map((preset) => (
                  <Button
                    key={preset}
                    variant={amount === preset.toString() ? "default" : "outline"}
                    className={amount === preset.toString() ? "web3-button" : "border-primary/20 hover:bg-primary/10"}
                    onClick={() => setAmount(preset.toString())}
                  >
                    ${preset}
                  </Button>
                ))}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="amount" className="text-foreground/80">
                  Custom amount
                </Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-muted/50 border-primary/20 focus:border-primary/50 focus:ring-primary/50"
                />
              </div>
              <div className="rounded-lg bg-muted/30 p-4 border border-primary/10">
                <h4 className="mb-2 font-medium text-foreground/90">Donation Impact</h4>
                <p className="text-sm text-foreground/70">
                  Your donation of ${amount || "0"} could result in a match of up to{" "}
                  <span className="text-web3-highlight font-medium">
                    ${amount ? (Number.parseFloat(amount) * 3).toFixed(2) : "0"}
                  </span>{" "}
                  based on the number of other contributors.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose} className="border-primary/20 hover:bg-primary/10">
                Cancel
              </Button>
              <Button
    onClick={handleDonate}
    disabled={
      !amount || isProcessing || Number.parseFloat(amount) <= 0 || Number.parseFloat(amount) > rewardTokenBalance ||!publicKey
    }
    className="web3-button"
  >
    {isProcessing ? (
      <>
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Processing...
      </>
    ) : (
      "Donate"
    )}
  </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="rounded-full bg-web3-highlight/20 p-3">
              <CheckCircle2 className="h-6 w-6 text-web3-highlight" />
            </div>
            <h3 className="mt-4 text-lg font-medium">Donation Successful!</h3>
            <p className="mt-2 text-center text-sm text-foreground/70">
              Thank you for your donation of ${amount} to {projectTitle}.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

