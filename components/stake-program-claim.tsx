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
import { ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";

import {PROGRAM_ID, STAKE_VAULT, STAKE_VAULT_AUTHORITY, STAKE_REWARD_TOKEN, getUserVaultAccount} from "../anchor/lib/addresses";

// Solana Connection
const connection = new Connection(RPC_LINK);

// Returns a card with button to call the claim function
export default function StakeProgramClaim() {
    const { publicKey, connected } = useWallet();
    const wallet = useAnchorWallet();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [stakedAmount, setStakedAmount] = useState<number | null>(null);
    const [lastClaimTime, setLastClaimTime] = useState<number | null>(null);
    const [timeElapsed, setTimeElapsed] = useState<number | null>(null);

    // Fetch staked amount and last claim time when component mounts
    useEffect(() => {
        if (connected && wallet && publicKey) {
            fetchUserAccountData();
        }
    }, [connected, publicKey]);

    // Update time elapsed every second
    useEffect(() => {
        if (lastClaimTime === null) return;
        
        const interval = setInterval(() => {
            const currentTime = Math.floor(Date.now() / 1000);
            setTimeElapsed(currentTime - lastClaimTime);
        }, 1000);
        
        return () => clearInterval(interval);
    }, [lastClaimTime]);

    const fetchUserAccountData = async () => {
        if (!wallet || !publicKey) return;

        try {
            const userVaultAccount = getUserVaultAccount(publicKey);
            const provider = new anchor.AnchorProvider(connection, wallet, anchor.AnchorProvider.defaultOptions());
            const program = new anchor.Program(IDL as Stake, provider);
            
            try {
                // @ts-ignore - userAccount exists in the IDL
                const userVaultAccountData = await program.account.userAccount.fetch(userVaultAccount);
                setStakedAmount(userVaultAccountData.stakeAmount / LAMPORTS_PER_SOL);
                setLastClaimTime(userVaultAccountData.lastClaimTime);
                
                // Calculate time elapsed since last claim
                const currentTime = Math.floor(Date.now() / 1000);
                setTimeElapsed(currentTime - userVaultAccountData.lastClaimTime);
            } catch (error) {
                console.log("User hasn't staked yet");
                setStakedAmount(0);
                setLastClaimTime(null);
                setTimeElapsed(null);
            }
        } catch (error) {
            console.error("Error fetching user account data:", error);
        }
    };

    const handleClaim = async () => {
        if (!wallet || !publicKey) {
            toast.error("Wallet not connected");
            return;
        }

        if (stakedAmount === 0) {
            toast.error("You need to stake SOL first");
            return;
        }

        try {
            setIsLoading(true);
            
            // Create provider and program
            const provider = new anchor.AnchorProvider(connection, wallet, anchor.AnchorProvider.defaultOptions());
            const program = new anchor.Program(IDL as Stake, provider);
            
            // Get user vault account
            const userVaultAccount = getUserVaultAccount(publicKey);
            
            // Get user's token account for rewards
            const { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } = await import('@solana/spl-token');
            const userStakeRewardTokenAccount = await getAssociatedTokenAddress(
                STAKE_REWARD_TOKEN,
                publicKey
            );
            
            // Execute claim transaction
            const tx = await program.methods
                .claim()
                .accounts({
                    user: publicKey,
                    stakeVault: STAKE_VAULT,
                    stakeVaultAuthority: STAKE_VAULT_AUTHORITY,
                    stakeRewardToken: STAKE_REWARD_TOKEN,
                    userAccount: userVaultAccount,
                    userStakeRewardTokenAccount: userStakeRewardTokenAccount,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    associatedTokenProgram: anchor.utils.token.ASSOCIATED_PROGRAM_ID,
                    systemProgram: anchor.web3.SystemProgram.programId,
                })
                .rpc();
            
            toast.success("Claim Successful", {
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
            console.log("Claim transaction signature:", tx);
            
            // Refresh user account data
            await fetchUserAccountData();
        } catch (error) {
            console.error("Error claiming:", error);
            toast.error("Failed to claim: " + (error as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate estimated rewards
    const calculateEstimatedRewards = () => {
        if (stakedAmount === null || timeElapsed === null) return 0;
        
        // REWARD = time_elapsed * REWARD_RATE * (stake_amount in SOL)
        // REWARD_RATE = 0.001 per second (from smart contract)
        const REWARD_RATE = 1000;
        return timeElapsed * REWARD_RATE * stakedAmount / 10**6;
    };

    return (
        <Card className="web3-card p-6 flex flex-col space-y-6">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20">
                  <Check className="h-4 w-4 text-blue-500" />
                </div>
                <h3 className="text-lg font-medium">Claim Rewards</h3>
              </div>

              <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground/70">Staked:</span>
                  <span className="font-medium">{stakedAmount?.toFixed(4)} SOL</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground/70">Time elapsed:</span>
                  <span className="font-medium">{timeElapsed} seconds</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground/70">Estimated rewards:</span>
                  <span className="font-medium text-blue-400">{calculateEstimatedRewards().toFixed(2)} tokens</span>
                </div>
              </div>

              <Button onClick={handleClaim} disabled={isLoading || !connected || stakedAmount === null || stakedAmount === 0}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white">Claim Rewards</Button>
            </Card>
    );
}
