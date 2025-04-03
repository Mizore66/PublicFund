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
import { ArrowRight, Plus } from "lucide-react";
import { toast } from "sonner";

import {PROGRAM_ID, STAKE_VAULT, STAKE_VAULT_AUTHORITY, STAKE_REWARD_TOKEN, getUserVaultAccount} from "../anchor/lib/addresses";
import { Input } from "./ui/input";

// Solana Connection
const connection = new Connection(RPC_LINK);

// Returns a card with input deposit amount and button to call the deposit function
export default function StakeProgramDeposit() {
    const { publicKey, connected } = useWallet();
    const wallet = useAnchorWallet();
    const [amount, setAmount] = useState<string>('0.1');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleDeposit = async () => {
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
            
            // Execute deposit transaction
            const tx = await program.methods
                .deposit(lamports)
                .accounts({
                    user: publicKey,
                    stakeVault: STAKE_VAULT,
                    stakeVaultAuthority: STAKE_VAULT_AUTHORITY,
                    userAccount: userVaultAccount,
                    systemProgram: anchor.web3.SystemProgram.programId,
                })
                .rpc();
            
            toast.success("Deposit Successful", {
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
            console.log("Deposit transaction signature:", tx);
            
            // Refresh balances after deposit
            // This will be handled by the parent component's useEffect
        } catch (error) {
            console.error("Error depositing:", error);
            toast.error("Failed to deposit: " + (error as Error).message);
        } finally {
            setIsLoading(false);
            // Refresh the page to show the updated balance
            window.location.reload();
        }
    };

    return (
        <Card className="web3-card p-6 flex flex-col space-y-6">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20">
                  <Plus className="h-4 w-4 text-green-500" />
                </div>
                <h3 className="text-lg font-medium">Deposit SOL</h3>
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

              <Button onClick={handleDeposit} 
                disabled={isLoading || !connected || parseFloat(amount) <= 0}
              className="w-full bg-green-500 hover:bg-green-600 text-white">Deposit SOL</Button>
            </Card>
    );
}
