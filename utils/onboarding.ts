import { createClient } from '@/utils/supabase/client';

interface UserData {
  username: string;
  walletAddress?: string;
  agentBehavior?: {
    liquidity: { slider: number; option: string };
    projectHistory: { slider: number; option: string };
    marketCap: { slider: number; option: string };
    socialSentiment: { slider: number; option: string };
    whaleMovements: { slider: number; option: string };
    riskTolerance: { slider: number; option: string };
  };
  avatar?: {
    avatarId: string;
    name: string;
  };
}

export const handleOnboardingSubmission = async (userData: UserData) => {
  const supabase = createClient();
 
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
   
    if (authError || !user) {
      throw new Error('No authenticated user found');
    }

    // Separate user data and agent data
    const userUpdateData = {
      username: userData.username,
      wallet_address: userData.walletAddress || null,
      is_onboarded: true
    };

    // Update user data
    const userResult = await supabase
      .from('users')
      .update(userUpdateData)
      .eq('user_id', user.id)
      .select();

    if (userResult.error) {
      throw new Error(`User update failed: ${JSON.stringify(userResult.error)}`);
    }

    // Format agent behavior data
    const agentUpdateData = {
      liquidity_num: userData.agentBehavior?.liquidity.slider || 0,
      liquidity_bin: userData.agentBehavior?.liquidity.option || '',
      history_num: userData.agentBehavior?.projectHistory.slider || 0,
      history_bin: userData.agentBehavior?.projectHistory.option || '',
      market_cap_num: userData.agentBehavior?.marketCap.slider || 0,
      market_cap_bin: userData.agentBehavior?.marketCap.option || '',
      sentiment_num: userData.agentBehavior?.socialSentiment.slider || 0,
      sentiment_bin: userData.agentBehavior?.socialSentiment.option || '',
      whale_num: userData.agentBehavior?.whaleMovements.slider || 0,
      whale_bin: userData.agentBehavior?.whaleMovements.option || '',
      risk_num: userData.agentBehavior?.riskTolerance.slider || 0,
      risk_bin: userData.agentBehavior?.riskTolerance.option || '',
      name: userData.avatar?.name || '',
      card: userData.avatar?.avatarId || ''
    };

    // Update agent data
    const agentResult = await supabase
      .from('agents')
      .update(agentUpdateData)
      .eq('user_id', user.id)
      .select();

    if (agentResult.error) {
      throw new Error(`Agent update failed: ${JSON.stringify(agentResult.error)}`);
    }

    // Create agent - simplified like the working example
    const agentResponse = await fetch('/api/create-agent', {
      method: 'POST'  // Removed headers and body as they might not be needed
    });

    if (!agentResponse.ok) {
      throw new Error('Failed to create agent');
    }

    console.log('Agent created successfully');
    return { success: true };

  } catch (error) {
    console.error('Error during onboarding:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

export type { UserData };