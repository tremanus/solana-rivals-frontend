"use client";

import { FC, useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Button } from "@/components/ui/button";
import { PublicKey } from "@solana/web3.js";

// Replace with a real Solana devnet token address
const TARGET_TOKEN_MINT = "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr"; // Devnet USDC
const REQUIRED_TOKEN_AMOUNT = 1000;

interface TokenAccountInfo {
  account: {
    data: {
      parsed: {
        info: {
          tokenAmount: {
            uiAmount: number;
          };
        };
      };
    };
  };
}

async function getTokenBalance(
  connection: any,
  ownerPublicKey: PublicKey,
  tokenMintAddress: string
): Promise<number> {
  try {
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      ownerPublicKey,
      {
        mint: new PublicKey(tokenMintAddress),
      }
    );

    const totalBalance = tokenAccounts.value.reduce(
      (acc: number, accountInfo: TokenAccountInfo) => {
        const parsedInfo = accountInfo.account.data.parsed.info;
        const balance = parsedInfo.tokenAmount.uiAmount || 0;
        return acc + balance;
      },
      0
    );

    return totalBalance;
  } catch (error) {
    console.error("Error fetching token balance:", error);
    throw error;
  }
}

interface WalletConnectionProps {
  onNext: (walletAddress: string) => void;
  defaultValue?: string;
}

export const WalletConnection: FC<WalletConnectionProps> = ({
  onNext,
  defaultValue,
}) => {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const [isChecking, setIsChecking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleContinue = async () => {
    if (!publicKey || !connection) return;

    setIsChecking(true);
    setErrorMessage("");

    try {
      const balance = await getTokenBalance(
        connection,
        publicKey,
        TARGET_TOKEN_MINT
      );

      if (balance >= REQUIRED_TOKEN_AMOUNT) {
        onNext(publicKey.toString());
      } else {
        setErrorMessage(
          `You need to hold at least ${REQUIRED_TOKEN_AMOUNT} $RIVALS tokens to continue.\n` +
            `Current balance: ${balance} $RIVALS \n` +
            `CA: ${TARGET_TOKEN_MINT}`
        );
      }
    } catch (error) {
      console.error("Error checking token balance:", error);
      setErrorMessage("Error checking token balance. Please try again.");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-white">Connect Your Wallet</h2>
      <p className="text-white/70 text-center">
        Connect your Solana wallet to continue with the onboarding process. You
        need at least {REQUIRED_TOKEN_AMOUNT} tokens to proceed.
      </p>

      <div className="flex flex-col items-center space-y-4">
        <WalletMultiButton className="!bg-purple-700 hover:!bg-purple-800" />

        {connected && publicKey && (
          <div className="flex flex-col items-center space-y-2">
            <p className="text-green-400">Wallet connected!</p>
            <p className="text-sm text-white/50 break-all text-center">
              {publicKey.toString()}
            </p>
            {errorMessage ? (
              <p className="text-red-400 text-center">{errorMessage}</p>
            ) : (
              <Button
                onClick={handleContinue}
                disabled={isChecking}
                className="bg-purple-700 text-white hover:bg-purple-800 transition-colors"
              >
                {isChecking ? "Checking Balance..." : "Continue"}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};