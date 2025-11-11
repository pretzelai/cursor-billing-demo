"use client";

import { PricingTable } from "@/components/ui/pricing-table";
import { useState, useEffect } from "react";

export default function PricingPage() {
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch current user on client side
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => {
        if (data.user?.id) {
          setUserId(data.user.id);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="dark min-h-screen bg-background flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dark min-h-screen bg-background p-4">
      <PricingTable
        lumenPublishableKey={process.env.NEXT_PUBLIC_LUMEN_PUBLISHABLE_KEY!}
        userId={userId}
        loginRedirectUrl="/login"
      />
    </div>
  );
}
