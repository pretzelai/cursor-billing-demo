"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, MessageSquare, Sparkles } from "lucide-react";
import { onCreditsConsumed } from "@/lib/credit-events";

interface CreditInfo {
  balance: number;
  allocation: number;
  displayName: string;
}

interface CreditsResponse {
  credits: Record<string, CreditInfo>;
  planName: string;
}

const featureIcons: Record<string, React.ReactNode> = {
  "ai-chat": <MessageSquare className="h-3 w-3" />,
  "tab-completion": <Sparkles className="h-3 w-3" />,
};

export default function CreditUsage() {
  const [data, setData] = useState<CreditsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCredits = useCallback(async () => {
    try {
      const response = await fetch("/api/credits");
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error("Failed to fetch credits:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCredits();

    // Refresh credits every 30 seconds
    const interval = setInterval(fetchCredits, 30000);

    // Listen for credit consumption events
    const unsubscribe = onCreditsConsumed(fetchCredits);

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, [fetchCredits]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Loader2 className="h-3 w-3 animate-spin" />
        <span>Loading...</span>
      </div>
    );
  }

  if (!data || Object.keys(data.credits).length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      {Object.entries(data.credits).map(([key, credit]) => {
        const percentage = Math.round((credit.balance / credit.allocation) * 100);
        const isLow = percentage < 20;

        return (
          <div
            key={key}
            className="flex items-center gap-2 text-xs"
            title={`${credit.displayName}: ${credit.balance.toLocaleString()} / ${credit.allocation.toLocaleString()} credits remaining`}
          >
            <span className="text-gray-400">
              {featureIcons[key] || <Sparkles className="h-3 w-3" />}
            </span>
            <span className="text-gray-400">{credit.displayName}:</span>
            <span className={isLow ? "text-orange-400" : "text-gray-300"}>
              {credit.balance.toLocaleString()}
            </span>
            <span className="text-gray-500">/</span>
            <span className="text-gray-500">
              {credit.allocation.toLocaleString()}
            </span>
          </div>
        );
      })}
    </div>
  );
}
