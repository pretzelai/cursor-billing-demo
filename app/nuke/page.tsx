"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function Spinner() {
  return (
    <svg
      className="animate-spin h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export default function NukePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleNuke = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/nuke", {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        setResult({ success: true, message: data.message });
      } else {
        setResult({ success: false, message: data.message || "Nuke failed" });
      }
    } catch (error: any) {
      setResult({ success: false, message: error.message || "Network error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-editor-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-sidebar-bg border-border-color">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-red-500">
            Database Nuke
          </CardTitle>
          <CardDescription className="text-gray-400">
            This will drop the entire stripe schema and run fresh migrations.
            All data will be lost.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="destructive"
            size="lg"
            className="w-full"
            onClick={handleNuke}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner />
                <span className="ml-2">Nuking...</span>
              </>
            ) : (
              "Nuke Database"
            )}
          </Button>

          {result && (
            <div
              className={`p-4 rounded-md text-sm ${
                result.success
                  ? "bg-green-900/50 text-green-300 border border-green-700"
                  : "bg-red-900/50 text-red-300 border border-red-700"
              }`}
            >
              {result.success ? "✓ " : "✗ "}
              {result.message}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
