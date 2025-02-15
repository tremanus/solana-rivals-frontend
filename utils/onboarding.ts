import { createClient } from '@/utils/supabase/client';

interface UserData {
  username: string;
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

const handleOnboardingSubmission = async (userData: UserData) => {
  const supabase = createClient();
  
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error('User error:', userError);
      throw userError;
    }
    if (!user) {
      console.error('No user found in session');
      throw new Error('No user found');
    }

    console.log('Current user:', user.id);
    console.log('Submitting user data:', userData);

    // Update the user record
    const { error: updateError } = await supabase
      .from('users')
      .update({
        username: userData.username,
        is_onboarded: true
      })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error updating user:', updateError);
      throw updateError;
    }

    console.log('Successfully updated user');

    // Get the newly created agent (created by trigger)
    const { data: agentData, error: agentError } = await supabase
      .from('agents')
      .select('agent_id')
      .eq('user_id', user.id)
      .single();

    if (agentError) {
      console.error('Error getting agent:', agentError);
      throw agentError;
    }

    if (!agentData) {
      console.error('No agent found for user');
      throw new Error('No agent found');
    }

    console.log('Found agent:', agentData);

    // Update the agent with the behavior data
    const agentUpdateData = {
        name: userData.avatar?.name || '',
        card: userData.avatar?.avatarId || '',
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
        risk_bin: userData.agentBehavior?.riskTolerance.option || ''
      };

    console.log('Updating agent with:', agentUpdateData);

    const { error: agentUpdateError } = await supabase
      .from('agents')
      .update(agentUpdateData)
      .eq('agent_id', agentData.agent_id);

    if (agentUpdateError) {
      console.error('Error updating agent:', agentUpdateError);
      throw agentUpdateError;
    }

    console.log('Successfully updated agent');
    return { success: true };
  } catch (error) {
    console.error('Detailed error during onboarding submission:', error);
    return { success: false, error };
  }
}

export { handleOnboardingSubmission, type UserData };