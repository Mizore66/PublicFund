// @ts-ignore
import IDL from "../anchor/lib/idl.json";
import {Stake} from "../anchor/lib/stake";
import * as anchor from "@coral-xyz/anchor";
import { useWallet, useAnchorWallet } from "@solana/wallet-adapter-react";
import {PublicKey, Connection, Keypair, LAMPORTS_PER_SOL} from "@solana/web3.js";
import { RPC_LINK } from "../anchor/lib/connection";

import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {useEffect, useState} from "react";
import { ArrowRight, Minus } from "lucide-react";
import { toast } from "sonner";

import {PROGRAM_ID, STAKE_VAULT, STAKE_VAULT_AUTHORITY, STAKE_REWARD_TOKEN, getUserVaultAccount} from "../anchor/lib/addresses";
import { Input } from "./ui/input";

// Solana Connection
const connection = new Connection(RPC_LINK);

// Returns a card with button to call the withdraw function
export default function StakeProgramWithdraw() {
    const { publicKey, connected } = useWallet();
    const wallet = useAnchorWallet();
    const [amount, setAmount] = useState<string>('0.05');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [stakedAmount, setStakedAmount] = useState<number | null>(null);

    // Fetch staked amount when component mounts
    useEffect(() => {
        if (connected && wallet && publicKey) {
            fetchStakedAmount();
        }
    }, [connected, publicKey]);

    const fetchStakedAmount = async () => {
        if (!wallet || !publicKey) return;

        try {
            const userVaultAccount = getUserVaultAccount(publicKey);
            const provider = new anchor.AnchorProvider(connection, wallet, anchor.AnchorProvider.defaultOptions());
            const program = new anchor.Program(IDL as Stake, provider);
            
            try {
                // @ts-ignore - userAccount exists in the IDL
                const userVaultAccountData = await program.account.userAccount.fetch(userVaultAccount);
                setStakedAmount(userVaultAccountData.stakeAmount / LAMPORTS_PER_SOL);
            } catch (error) {
                console.log("User hasn't staked yet");
                setStakedAmount(0);
            }
        } catch (error) {
            console.error("Error fetching staked amount:", error);
        }
    };

    const handleWithdraw = async () => {
        if (!wallet || !publicKey) {
            toast.error("Wallet not connected");
            return;
        }

        try {
            setIsLoading(true);
            
            // Convert amount to lamports
            const lamports = new anchor.BN(parseFloat(amount) * LAMPORTS_PER_SOL);
            
            // Create provider and program
            const provider = new anchor.AnchorProvider(connection, wallet, anchor.AnchorProvider.defaultOptions());
            const program = new anchor.Program(IDL as Stake, provider);
            
            // Get user vault account
            const userVaultAccount = getUserVaultAccount(publicKey);
            
            // Execute withdraw transaction
            const tx = await program.methods
                .withdraw(lamports)
                .accounts({
                    user: publicKey,
                    stakeVault: STAKE_VAULT,
                    stakeVaultAuthority: STAKE_VAULT_AUTHORITY,
                    userAccount: userVaultAccount,
                    systemProgram: anchor.web3.SystemProgram.programId,
                })
                .rpc();
            
            toast.success("Withdrawal Successful", {
                description: (
                <a
                    href={`https://explorer.solana.com/tx/${tx}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 underline flex items-center"
                >
                    View on Explorer <ArrowRight className="ml-1 h-3 w-3" />
                </a>
                ),
            });
            console.log("Withdraw transaction signature:", tx);
            
            // Refresh staked amount
            await fetchStakedAmount();
        } catch (error) {
            console.error("Error withdrawing:", error);
            toast.error("Failed to withdraw: " + (error as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="web3-card p-6 flex flex-col space-y-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20">
            <Minus className="h-4 w-4 text-red-500" />
          </div>
          <h3 className="text-lg font-medium">Withdraw SOL</h3>
        </div>

        <div className="flex gap-2">
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-muted/50 border-primary/20"
          />
          <div className="bg-muted/80 rounded px-4 py-2 flex items-center justify-center font-medium">SOL</div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span>Available:</span>
          <span>{stakedAmount?.toFixed(4)} SOL</span>
        </div>

        <Button onClick={handleWithdraw} 
        disabled={isLoading || !connected || parseFloat(amount) <= 0 || (stakedAmount !== null && parseFloat(amount) > stakedAmount)}
        className="w-full bg-red-500 hover:bg-red-600 text-white">Withdraw SOL</Button>
      </Card>
    );
}
