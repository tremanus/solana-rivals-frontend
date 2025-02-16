// app/api/wallet/balance/route.ts
import { NextResponse } from 'next/server';
import { getDatabase } from '@/utils/supabase/functions';
import { getWalletBalances } from '@/utils/solana/walletBalances';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('Starting wallet balance route...');
    
    // Initialize the Supabase client
    const supabase = await getDatabase();
    console.log('Database connection established');
    
    // Get the current session and user
    const { data: { session } } = await supabase.auth.getSession();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    console.log('Session check:', {
      hasSession: !!session,
      hasUser: !!user,
      userError: userError?.message
    });

    if (userError || !user) {
      console.error('User authentication failed:', userError);
      return NextResponse.json(
        { message: 'Unauthorized - invalid user' },
        { status: 401 }
      );
    }

    if (!session?.access_token) {
      console.error('No valid session token');
      return NextResponse.json(
        { message: 'Unauthorized - no valid session token' },
        { status: 401 }
      );
    }

    // Get the agent's wallet address
    console.log('Fetching agent wallet address for user:', user.id);
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .select('wallet_address')
      .eq('user_id', user.id)
      .single();

    console.log('Agent query result:', {
      hasAgent: !!agent,
      walletAddress: agent?.wallet_address,
      error: agentError?.message
    });

    if (agentError || !agent?.wallet_address) {
      console.error('Failed to get wallet address:', agentError);
      return NextResponse.json(
        { error: 'Wallet address not found' },
        { status: 404 }
      );
    }

    // Get wallet balances
    console.log('Fetching wallet balances for address:', agent.wallet_address);
    const balances = await getWalletBalances(agent.wallet_address);
    console.log('Retrieved balances:', balances);

    // Update the agent's current balances
    console.log('Updating agent balances in database');
    const { error: updateError } = await supabase
      .from('agents')
      .update({
        current_sol: balances.totalSolValue,
        current_usd: balances.totalUsdValue
      })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error updating balances:', updateError);
      return NextResponse.json(
        { error: 'Failed to update balances' },
        { status: 500 }
      );
    }

    console.log('Successfully completed wallet balance request');
    return NextResponse.json(balances);
  } catch (error) {
    console.error('Detailed error in wallet balance route:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      {
        message: 'Internal server error',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}