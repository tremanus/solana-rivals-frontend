// utils/solana/walletBalances.ts
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import axios from 'axios';

interface TokenBalance {
  mint: string;
  balance: number;
  decimals: number;
  usdValue?: number;
}

/**
 * Gets the current price of a token given its contract address
 * @param tokenAddress The contract address of the token
 * @returns The current price as a decimal number, or null if price cannot be fetched
 */
export async function getPrice(tokenAddress: string): Promise<number | null> {
  try {
    // DexScreener API endpoint
    const url = `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`;
    const response = await axios.get(url);
    
    if (!response.data?.pairs || response.data.pairs.length === 0) {
      return null;
    }

    // Get the first pair's price (usually the most liquid one)
    const price = response.data.pairs[0].priceUsd;
    return price ? parseFloat(price) : null;
  } catch (error) {
    console.error(`Error fetching price for token ${tokenAddress}:`, error);
    return null;
  }
}

// Function to check if token is legitimate
async function isLegitimateToken(mint: string): Promise<boolean> {
  try {
    const url = `https://api.dexscreener.com/latest/dex/tokens/${mint}`;
    const response = await axios.get(url);
    
    if (!response.data?.pairs || response.data.pairs.length === 0) {
      return false;
    }

    // Check total volume across all pairs
    const totalVolume = response.data.pairs.reduce((sum: number, pair: any) =>
      sum + parseFloat(pair.volume?.h24 || '0'), 0);

    return totalVolume > 100000; // $100k daily volume threshold
  } catch (error) {
    return false;
  }
}

export async function getWalletBalances(walletAddress: string): Promise<{
  solBalance: number;
  solValue: number;
  tokens: TokenBalance[];
  totalUsdValue: number;
  totalSolValue: number;
}> {
  try {
    // Initialize connection to Solana
    const connection = new Connection(
      'https://api.mainnet-beta.solana.com',
      'confirmed'
    );

    const walletPublicKey = new PublicKey(walletAddress);

    // Get SOL balance
    const solBalanceLamports = await connection.getBalance(walletPublicKey);
    const solBalance = solBalanceLamports / LAMPORTS_PER_SOL;

    // Get SOL price and calculate value
    const solPrice = await getPrice("So11111111111111111111111111111111111111112");
    const solValue = solPrice ? solPrice * solBalance : 0;

    // Get token accounts
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      walletPublicKey,
      {
        programId: TOKEN_PROGRAM_ID,
      },
      'confirmed'
    );

    // Process tokens
    const tokens = await Promise.all(
      tokenAccounts.value
        .map(async (accountInfo) => {
          const parsedInfo = accountInfo.account.data.parsed.info;
          const balance = Number(parsedInfo.tokenAmount.uiAmount);
          const mint = parsedInfo.mint;

          // Skip tokens with zero balance
          if (balance <= 0) return null;

          // Verify token legitimacy
          const isLegit = await isLegitimateToken(mint);
          if (!isLegit) return null;

          const price = await getPrice(mint);
          const usdValue = price ? price * balance : 0;

          return {
            mint,
            balance,
            decimals: parsedInfo.tokenAmount.decimals,
            usdValue,
          };
        })
    );

    // Filter out null values and calculate totals
    const validTokens = tokens.filter((token): token is NonNullable<typeof token> => token !== null);
    const totalUsdValue = validTokens.reduce((sum, token) => sum + (token.usdValue || 0), 0) + solValue;
    const totalSolValue = solPrice ? totalUsdValue / solPrice : 0;

    return {
      solBalance,
      solValue,
      tokens: validTokens,
      totalUsdValue,
      totalSolValue,
    };
  } catch (error) {
    console.error('Error fetching wallet balances:', error);
    throw error;
  }
}