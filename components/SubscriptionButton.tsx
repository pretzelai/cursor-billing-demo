"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Loader2, Crown } from "lucide-react";

interface SubscriptionStatus {
  hasActiveSubscription: boolean;
  planName?: string;
}

export default function SubscriptionButton() {
  const router = useRouter();
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptionStatus();
  }, []);

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await fetch("/api/subscription-status");

      if (response.ok) {
        const data = await response.json();
        console.log("Subscription data:", data); // Debug log

        const subscriptionData = data.subscriptionStatus;

        // Check if user has an active subscription using the hasActiveSubscription field
        const hasActiveSubscription = subscriptionData?.hasActiveSubscription || false;

        // Get plan name from subscription data (it's planName, not plan.name)
        const planName = subscriptionData?.subscription?.planName || "Free";

        setStatus({
          hasActiveSubscription,
          planName,
        });
      } else {
        // User not subscribed or error
        setStatus({
          hasActiveSubscription: false,
        });
      }
    } catch (error) {
      console.error("Failed to fetch subscription status:", error);
      setStatus({
        hasActiveSubscription: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = () => {
    router.push("/pricing");
  };

  if (isLoading) {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled
        className="bg-sidebar-bg border-border-color text-white"
      >
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    );
  }

  if (status?.hasActiveSubscription) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleClick}
        className="bg-sidebar-bg border-border-color text-white hover:bg-editor-bg flex items-center gap-2"
      >
        <Crown className="h-4 w-4 text-yellow-500" />
        {status.planName}
      </Button>
    );
  }

  return (
    <Button
      size="sm"
      onClick={handleClick}
      className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
    >
      Upgrade
    </Button>
  );
}

