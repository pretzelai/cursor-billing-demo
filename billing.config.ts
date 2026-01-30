import { defineConfig } from "stripe-no-webhooks";

export default defineConfig({
  test: {
    plans: [
      {
        id: "prod_Tt33OTGHadmPDv",
        name: "Free",
        description: "Cursor free plan",
        price: [
          {
            id: "price_1SvGx4Hl6H1Zw3aLHjviBZJu",
            amount: 0,
            currency: "usd",
            interval: "month",
          },
        ],
        features: {
          "ai-chat": {
            credits: {
              allocation: 1000,
            },
            displayName: "AI Chat",
          },
          "tab-completion": {
            credits: {
              allocation: 1000,
            },
            displayName: "Tab Completion",
          },
        },
      },
      {
        id: "prod_Tt337BMhz7UN3H",
        name: "Pro",
        description: "Cursor Pro plan",
        price: [
          {
            id: "price_1SvGx5Hl6H1Zw3aLGZNGRRBY",
            amount: 1000,
            currency: "usd",
            interval: "month",
          },
          {
            id: "price_1SvGx5Hl6H1Zw3aLEOgEWcsC",
            amount: 10000,
            currency: "usd",
            interval: "year",
          },
        ],
        features: {
          "ai-chat": {
            credits: {
              allocation: 10000,
            },
            displayName: "AI Chat",
          },
          "tab-completion": {
            credits: {
              allocation: 10000,
            },
            displayName: "Tab Completion",
          },
        },
      },
    ],
  },
  production: {
    plans: [],
  },
});
