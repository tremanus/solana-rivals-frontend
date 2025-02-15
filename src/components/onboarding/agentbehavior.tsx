"use client"

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface AgentBehaviorProps {
  defaultValues?: {
    liquidity: { slider: number; option: string };
    projectHistory: { slider: number; option: string };
    marketCap: { slider: number; option: string };
    socialSentiment: { slider: number; option: string };
    whaleMovements: { slider: number; option: string };
    riskTolerance: { slider: number; option: string };
  };
  onSubmit: (values: AgentBehaviorProps['defaultValues']) => void;
}

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

export function AgentBehavior({ defaultValues, onSubmit }: AgentBehaviorProps) {
  const [values, setValues] = React.useState<{ [key: string]: { slider: number; option: string } }>(
    defaultValues || Object.fromEntries(
      questions.map(q => [q.id, { slider: -1, option: '' }])
    )
  );

  const [touched, setTouched] = React.useState<{ [key: string]: boolean }>(
    Object.fromEntries(questions.map(q => [q.id, false]))
  );

  const handleSliderChange = (sliderValue: number[], id: string) => {
    setTouched(prev => ({ ...prev, [id]: true }));
    const newValues = {
      ...values,
      [id]: { ...values[id], slider: sliderValue[0] }
    };
    setValues(newValues);
    onSubmit(newValues as AgentBehaviorProps['defaultValues']);
  };

  const handleSelectChange = (option: string, id: string) => {
    const newValues = {
      ...values,
      [id]: { ...values[id], option }
    };
    setValues(newValues);
    onSubmit(newValues as AgentBehaviorProps['defaultValues']);
  };

  const isComplete = Object.entries(values).every(
    ([_, value]) => value.slider >= 0 && value.option !== ''
  );

  return (
    <Card className="w-full max-w-3xl bg-[#051B2C]/50 border-white/10">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white">Configure Your Agent</CardTitle>
        <CardDescription style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
          Customize how your AI trading agent behaves in different market conditions
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
                    {touched[q.id] && values[q.id].slider === -1 && (
                      <span className="text-red-500 ml-2">*</span>
                    )}
                  </Label>
                  <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>{q.description}</p>
                </div>
                <div className="space-y-4 px-2">
                  <Slider
                    value={[values[q.id].slider === -1 ? 0 : values[q.id].slider]}
                    onValueChange={(value) => handleSliderChange(value, q.id)}
                    max={100}
                    step={1}
                    className={cn(
                      "py-4",
                      touched[q.id] && values[q.id].slider === -1 && "border-red-500"
                    )}
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
                      <SelectTrigger 
                        className={cn(
                          "w-auto min-w-[120px] bg-white/5 border-white/10 text-white",
                          !values[q.id].option && touched[q.id] && "border-red-500"
                        )}
                      >
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
    </Card>
  );
}
