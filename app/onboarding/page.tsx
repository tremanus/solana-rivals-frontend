"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { UsernameStep } from "@/src/components/onboarding/username";
import { AgentBehavior } from "@/src/components/onboarding/agentbehavior";
import { AvatarSelection } from "@/src/components/onboarding/avatar";
import { ChevronRight } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Review } from "@/src/components/onboarding/review";
import { useRouter } from "next/navigation";
import { handleOnboardingSubmission } from "@/utils/onboarding";
import { createClient } from "@/utils/supabase/client";
import { WalletConnection } from "@/src/components/onboarding/wallet-connection";
import { WalletContextProvider } from "@/src/components/wallet-provider";
import { OnboardingProvider } from './context'

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

const OnboardingPage = () => {
  const router = useRouter();
  const supabase = createClient();
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState<UserData>({
    username: "",
    walletAddress: "",
    agentBehavior: {
      liquidity: { slider: 0, option: "" },
      projectHistory: { slider: 0, option: "" },
      marketCap: { slider: 0, option: "" },
      socialSentiment: { slider: 0, option: "" },
      whaleMovements: { slider: 0, option: "" },
      riskTolerance: { slider: 0, option: "" },
    },
    avatar: {
      avatarId: "",
      name: "",
    },
  });

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      // Get current user
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error("Error getting user:", authError);
        router.push("/login");
        return;
      }

      // Check onboarding status
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("is_onboarded")
        .eq("user_id", user.id)
        .single();

      if (!userError && userData?.is_onboarded) {
        router.push("/dashboard");
        return;
      }
    };

    checkOnboardingStatus();
  }, []);

  const handleComplete = async () => {
    try {
      const result = await handleOnboardingSubmission(userData);
      if (result.success) {
        router.push("/dashboard");
      } else {
        console.error("Submission failed:", result.error);
        alert(`Failed to complete onboarding: ${result.error}`);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Error during onboarding:", errorMessage);
      alert(`Something went wrong: ${errorMessage}`);
    }
  };

  const steps = [
    "Connect Wallet",
    "Username",
    "Customize Agent",
    "Avatar",
    "Review",
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleWalletSubmit = (walletAddress: string) => {
    console.log("Wallet address received in onboarding:", walletAddress);
    setUserData((prev) => {
      const newData = { ...prev, walletAddress };
      console.log("Updated userData:", newData);
      return newData;
    });
    handleNext();
  };

  const handleUsernameSubmit = (username: string) => {
    setUserData((prev) => ({ ...prev, username }));
    handleNext();
  };

  const handleAgentBehaviorSubmit = (behavior: UserData["agentBehavior"]) => {
    setUserData((prev) => ({ ...prev, agentBehavior: behavior }));
    handleNext();
  };

  const handleAvatarSubmit = (avatarData: UserData["avatar"]) => {
    setUserData((prev) => ({ ...prev, avatar: avatarData }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <WalletConnection
            onNext={handleWalletSubmit}
            defaultValue={userData.walletAddress}
          />
        );
      case 1:
        return (
          <UsernameStep
            onNext={handleUsernameSubmit}
            defaultValue={userData.username}
          />
        );
      case 2:
        return (
          <>
            <div className="flex justify-center">
              <AgentBehavior
                defaultValues={userData.agentBehavior}
                onSubmit={(values) =>
                  setUserData((prev) => ({ ...prev, agentBehavior: values }))
                }
              />
            </div>
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handleBack}
                className="border-white/10 bg-white/5 hover:bg-white/10 text-white"
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={
                  !userData.agentBehavior ||
                  Object.values(userData.agentBehavior).some(
                    (value) => value.slider === -1 || !value.option
                  )
                }
                className="bg-purple-700 text-white hover:bg-purple-800 transition-colors disabled:opacity-50"
              >
                Continue
              </Button>
            </div>
          </>
        );
      case 3: // Avatar step
        return (
          <>
            <AvatarSelection
              defaultValues={userData.avatar}
              onSubmit={handleAvatarSubmit}
            />
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handleBack}
                className="border-white/10 bg-white/5 hover:bg-white/10 text-white"
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={!userData.avatar?.name || !userData.avatar?.avatarId}
                className="bg-purple-700 text-white hover:bg-purple-800 transition-colors disabled:opacity-50"
              >
                Continue
              </Button>
            </div>
          </>
        );
      case 4: // Review step
        return (
          <>
            <Review
              userData={{
                ...userData,
                agentBehavior: userData.agentBehavior, // Pass the full agentBehavior object
              }}
            />

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handleBack}
                className="border-white/10 bg-white/5 hover:bg-white/10 text-white"
              >
                Back
              </Button>
              <Button
                onClick={handleComplete}
                className="bg-purple-700 text-white hover:bg-purple-800 transition-colors"
              >
                Complete
              </Button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  console.log("Current userData:", userData);

  return (
    <OnboardingProvider>
      <WalletContextProvider>
        <div className="min-h-screen bg-[#0B1220] text-white antialiased">
          <div className="max-w-4xl mx-auto p-4 pt-8">
            {/* Breadcrumb Navigation */}
            <div className="mb-8 flex justify-center">
              <Breadcrumb>
                <BreadcrumbList>
                  {steps.map((step, index) => (
                    <React.Fragment key={step}>
                      <BreadcrumbItem
                        className={cn(
                          "font-medium",
                          currentStep > index && "text-white/40 line-through",
                          currentStep === index && "text-zinc-50",
                          currentStep < index && "text-gray/400"
                        )}
                      >
                        {currentStep > index ? (
                          <BreadcrumbLink
                            className="hover:text-white"
                            onClick={() => setCurrentStep(index)}
                          >
                            {step}
                          </BreadcrumbLink>
                        ) : (
                          <BreadcrumbPage>{step}</BreadcrumbPage>
                        )}
                      </BreadcrumbItem>
                      {index < steps.length - 1 && (
                        <BreadcrumbSeparator>
                          <ChevronRight
                            className={cn(
                              "h-4 w-4",
                              currentStep > index
                                ? "text-white/40"
                                : "text-white/40"
                            )}
                          />
                        </BreadcrumbSeparator>
                      )}
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            {/* Content */}
            <div className="min-h-[400px]">{renderStep()}</div>
          </div>
        </div>
      </WalletContextProvider>
    </OnboardingProvider>
  );
};

export default OnboardingPage;