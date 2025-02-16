"use client";

import { FC, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Button } from "@/components/ui/button";
import { ClientOnly } from "@/src/components/client-only";

/* Commented out token requirement logic
const TARGET_TOKEN_MINT = "So11111111111111111111111111111111111111112"; // Solana
const REQUIRED_TOKEN_AMOUNT = 0.05;

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
*/

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
    onNext(publicKey.toString());
  };

  return (
    <ClientOnly>
      <div className="flex flex-col items-center space-y-6 max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-white">Connect Your Wallet</h2>
        <p className="text-white/70 text-center">
          Connect your Solana wallet to continue with the onboarding process.
        </p>

        <div className="flex flex-col items-center space-y-4">
          <WalletMultiButton className="!bg-purple-700 hover:!bg-purple-800" />

          {connected && publicKey && (
            <div className="flex flex-col items-center space-y-2">
              <p className="text-green-400">Wallet connected!</p>
              <Button
                onClick={handleContinue}
                disabled={isChecking}
                className="bg-purple-700 text-white hover:bg-purple-800 transition-colors"
              >
                Continue
              </Button>
            </div>
          )}
        </div>
      </div>
    </ClientOnly>
  );
};