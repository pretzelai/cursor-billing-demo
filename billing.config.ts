import { defineConfig } from "stripe-no-webhooks";

export default defineConfig({
  test: {
    plans: [
      {
        id: "prod_Tt4spzYHMqqEJr",
        name: "Free",
        description: "Cursor free plan",
        price: [
          {
            id: "price_1SvIisPK0CzHw6Ehvmhl9nDD",
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
        id: "prod_Tt4sKcqDWOUbCE",
        name: "Pro",
        description: "Cursor Pro plan",
        price: [
          {
            id: "price_1SvIisPK0CzHw6EhDELgMJUg",
            amount: 1000,
            currency: "usd",
            interval: "month",
          },
          {
            id: "price_1SvIitPK0CzHw6EhDmbPgQgb",
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
