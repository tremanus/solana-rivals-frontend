"use client";
import { ReactNode } from "react";
import * as WalletAdapter from "@solana/wallet-adapter-react";
import * as WalletUI from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

const ConnectionProvider = WalletAdapter.ConnectionProvider as any;
const WalletProvider = WalletAdapter.WalletProvider as any;
const WalletModalProvider = WalletUI.WalletModalProvider as any;

export const WalletContextProvider = ({ children }: { children: ReactNode }) => {
  const endpoint = clusterApiUrl("devnet");
  const wallets = [new PhantomWalletAdapter()];

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};