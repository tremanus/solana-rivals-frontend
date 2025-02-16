"use client"

import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import React, { useEffect, useState } from "react";
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const questions = [
  {
    id: "liquidity",
    question: "How quickly do you need to exit your trade?",
    description: "Determines your agent's liquidity preferences and potential exit strategies.",
    leftLabel: "Can wait days",
    rightLabel: "I like fast exits",
    fillInTheBlank: "I require my investments to be liquid enough to exit within _______.",
    options: ["minutes", "hours", "days"]
  },
  {
    id: "projectHistory",
    question: "How important is a project's track record to you?",
    description: "Influences which tokens your agent will consider based on historical performance and established credibility.",
    leftLabel: "New projects fine",
    rightLabel: "Only well-established",
    fillInTheBlank: "I prefer projects that have been operational for at least _______",
    options: ["no history", ">10 hours", ">24 hours", ">72 hours", "Over a week"]
  },
  {
    id: "marketCap",
    question: "What size projects do you prefer trading?",
    description: "Sets your agent's market cap preferences, reflecting the balance between risk and stability.",
    leftLabel: "Small caps/New tokens",
    rightLabel: "Large established tokens",
    fillInTheBlank: "I favor projects with a market cap of _______.",
    options: ["100k+", "$500k+", "1 million+", "5 million+"]
  },
  {
    id: "socialSentiment",
    question: "How much do social media trends influence your trading decisions?",
    description: "Determines how much weight your agent gives to social signals and market sentiment in its decision-making.",
    leftLabel: "Never",
    rightLabel: "Always check socials",
    fillInTheBlank: "I adjust my trading strategy based on social media sentiment _______.",
    options: ["not at all", "slightly", "moderately", "heavily"]
  },
  {
    id: "whaleMovements",
    question: "How significantly do large wallet movements (whale actions) affect your trades?",
    description: "Sets your agent's behavior regarding tracking and reacting to large-scale market moves.",
    leftLabel: "Don't care",
    rightLabel: "Always follow big money",
    fillInTheBlank: "I monitor large wallet movements _______ for my trading decisions.",
    options: ["not at all", "occasionally", "regularly", "in detail"]
  },
  {
    id: "riskTolerance",
    question: "What is your risk tolerance?",
    description: "Defines your agent's overall risk profile and guides the balance between conservative and aggressive strategies.",
    leftLabel: "Very conservative",
    rightLabel: "High risk/reward",
    fillInTheBlank: "My risk tolerance level is _______.",
    options: ["very conservative 10-25% gains/losses", "Balanced 25-50% gains/losses", "growth oriented 50-100% gains/losses", "aggressive 100%+ gains/losses"]
  }
];

function AgentSettingsContent() {
    const router = useRouter();
    const supabase = createClient();
    const [values, setValues] = useState<{ [key: string]: { slider: number; option: string } }>(
      Object.fromEntries(questions.map(q => [q.id, { slider: 0, option: '' }]))
    );
    const [isLoading, setIsLoading] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
  
    useEffect(() => {
      const fetchAgentSettings = async () => {
        try {
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          if (userError) throw userError;
          if (!user) throw new Error('No user found');
  
          const { data: agentData, error: agentError } = await supabase
            .from('agents')
            .select('*')
            .eq('user_id', user.id)
            .single();
  
          if (agentError) throw agentError;
          if (!agentData) throw new Error('No agent found');
  
          setValues({
            liquidity: { slider: agentData.liquidity_num, option: agentData.liquidity_bin },
            projectHistory: { slider: agentData.history_num, option: agentData.history_bin },
            marketCap: { slider: agentData.market_cap_num, option: agentData.market_cap_bin },
            socialSentiment: { slider: agentData.sentiment_num, option: agentData.sentiment_bin },
            whaleMovements: { slider: agentData.whale_num, option: agentData.whale_bin },
            riskTolerance: { slider: agentData.risk_num, option: agentData.risk_bin }
          });
        } catch (error) {
          console.error('Error fetching agent settings:', error);
        }
      };
  
      fetchAgentSettings();
    }, []);
  
    const handleSliderChange = (sliderValue: number[], id: string) => {
      const newValues = {
        ...values,
        [id]: { ...values[id], slider: sliderValue[0] }
      };
      setValues(newValues);
      setHasChanges(true);
    };
  
    const handleSelectChange = (option: string, id: string) => {
      const newValues = {
        ...values,
        [id]: { ...values[id], option }
      };
      setValues(newValues);
      setHasChanges(true);
    };
  
    const handleSaveChanges = async () => {
      setIsLoading(true);
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) throw new Error('No user found');
  
        const { error: updateError } = await supabase
          .from('agents')
          .update({
            liquidity_num: values.liquidity.slider,
            liquidity_bin: values.liquidity.option,
            history_num: values.projectHistory.slider,
            history_bin: values.projectHistory.option,
            market_cap_num: values.marketCap.slider,
            market_cap_bin: values.marketCap.option,
            sentiment_num: values.socialSentiment.slider,
            sentiment_bin: values.socialSentiment.option,
            whale_num: values.whaleMovements.slider,
            whale_bin: values.whaleMovements.option,
            risk_num: values.riskTolerance.slider,
            risk_bin: values.riskTolerance.option
          })
          .eq('user_id', user.id);
  
        if (updateError) throw updateError;
        
        setHasChanges(false);
        router.push('/dashboard');
      } catch (error) {
        console.error('Error updating agent settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <Card className="w-full max-w-3xl bg-[#051B2C]/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Agent Settings</CardTitle>
          <CardDescription style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            Modify your AI trading agent's behavior and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            {questions.map((q, index) => (
              <React.Fragment key={q.id}>
                <div style={{ marginBottom: '32px' }}>
                  <div className="space-y-2">
                    <Label className="text-lg font-medium text-white">
                      {q.question}
                    </Label>
                    <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>{q.description}</p>
                  </div>
                  <div className="space-y-4 px-2">
                    <Slider
                      value={[values[q.id].slider]}
                      onValueChange={(value) => handleSliderChange(value, q.id)}
                      max={100}
                      step={1}
                      className="py-4"
                    />
                    <div className="flex justify-between text-sm">
                      <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>{q.leftLabel}</span>
                      <span className="font-medium text-white">{values[q.id].slider}%</span>
                      <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>{q.rightLabel}</span>
                    </div>
                    
                    <div className="mt-4 flex items-center gap-2">
                      <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                        {q.fillInTheBlank.split('_______')[0]}
                      </p>
                      <Select
                        value={values[q.id].option}
                        onValueChange={(value) => handleSelectChange(value, q.id)}
                      >
                        <SelectTrigger className="w-auto min-w-[120px] bg-white/5 border-white/10 text-white">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          {q.options.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                        {q.fillInTheBlank.split('_______')[1]}
                      </p>
                    </div>
                  </div>
                </div>
                
                {index < questions.length - 1 && (
                  <div className="flex justify-center mb-8">
                    <div className="flex items-center gap-2">
                      <div className="h-[1px] w-4 bg-white/20" />
                      <div className="h-[1px] w-4 bg-white/20" />
                      <div className="h-[1px] w-4 bg-white/20" />
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
        <CardFooter className="pt-6">
          <div className="w-full flex justify-end">
            <Button 
              onClick={handleSaveChanges} 
              disabled={!hasChanges || isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg font-medium"
              style={{ fontFamily: 'Courier, monospace' }}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    );
  }
  
  export default function AgentSettingsPage() {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="min-h-screen bg-[#060606] relative">
            <div className="max-w-7xl mx-auto p-6 relative z-10">
              <div className="flex justify-center items-start gap-16">
                <AgentSettingsContent />
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }