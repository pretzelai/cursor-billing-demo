import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";

const SCHEMA = "stripe";

async function runMigrations(client: Client) {
  // Import runMigrations from stripe-sync-engine
  const { runMigrations } = await import("@pretzelai/stripe-sync-engine");

  const databaseUrl = process.env.DATABASE_URL!;

  await runMigrations({
    databaseUrl,
    schema: SCHEMA,
    logger: { info: () => {}, error: console.error },
  });

  await client.query(`
    CREATE TABLE IF NOT EXISTS ${SCHEMA}.user_stripe_customer_map (
      user_id text PRIMARY KEY,
      stripe_customer_id text UNIQUE NOT NULL,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS ${SCHEMA}.credit_balances (
      user_id text NOT NULL,
      key text NOT NULL,
      balance bigint NOT NULL DEFAULT 0,
      currency text,
      updated_at timestamptz DEFAULT now(),
      PRIMARY KEY (user_id, key)
    );
  `);

  await client.query(`
    ALTER TABLE ${SCHEMA}.credit_balances
      ADD COLUMN IF NOT EXISTS currency text;
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS ${SCHEMA}.credit_ledger (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id text NOT NULL,
      key text NOT NULL,
      amount bigint NOT NULL,
      balance_after bigint NOT NULL,
      transaction_type text NOT NULL,
      source text NOT NULL,
      source_id text,
      description text,
      metadata jsonb,
      idempotency_key text UNIQUE,
      created_at timestamptz DEFAULT now()
    );
  `);

  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_credit_ledger_user_key_time
      ON ${SCHEMA}.credit_ledger(user_id, key, created_at DESC);
  `);

  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_credit_ledger_source_id
      ON ${SCHEMA}.credit_ledger(source_id);
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS ${SCHEMA}.topup_failures (
      user_id TEXT NOT NULL,
      key TEXT NOT NULL,
      payment_method_id TEXT,
      decline_type TEXT NOT NULL,
      decline_code TEXT,
      failure_count INTEGER DEFAULT 1,
      last_failure_at TIMESTAMPTZ DEFAULT NOW(),
      disabled BOOLEAN DEFAULT FALSE,
      PRIMARY KEY (user_id, key)
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS ${SCHEMA}.usage_events (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id text NOT NULL,
      key text NOT NULL,
      amount numeric NOT NULL,
      stripe_meter_event_id text,
      period_start timestamptz NOT NULL,
      period_end timestamptz NOT NULL,
      created_at timestamptz DEFAULT now()
    );
  `);

  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_usage_events_user_key_period
      ON ${SCHEMA}.usage_events(user_id, key, period_start, period_end);
  `);
}

export async function POST(request: NextRequest) {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return NextResponse.json(
      { error: "config_error", message: "DATABASE_URL not configured" },
      { status: 500 }
    );
  }

  let client: Client | null = null;

  try {
    client = new Client({ connectionString: databaseUrl });
    await client.connect();

    // Drop the stripe schema cascade
    console.log("[API] Nuke: Dropping stripe schema...");
    await client.query(`DROP SCHEMA IF EXISTS ${SCHEMA} CASCADE;`);
    console.log("[API] Nuke: Schema dropped successfully");

    // Run migrations
    console.log("[API] Nuke: Running migrations...");
    await runMigrations(client);
    console.log("[API] Nuke: Migrations completed successfully");

    await client.end();

    return NextResponse.json({
      success: true,
      message: "Database nuked and migrations run successfully",
    });
  } catch (error: any) {
    console.error("[API] Nuke error:", error);
    if (client) {
      await client.end().catch(() => {});
    }
    return NextResponse.json(
      { error: "nuke_failed", message: error.message },
      { status: 500 }
    );
  }
}
