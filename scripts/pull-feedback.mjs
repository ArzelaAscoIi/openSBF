#!/usr/bin/env node
/**
 * Pull all feedback submissions from Supabase to stdout (JSON) or a local file.
 *
 * Usage:
 *   node scripts/pull-feedback.mjs
 *   node scripts/pull-feedback.mjs --output feedback.json
 *   node scripts/pull-feedback.mjs --type bug
 *   node scripts/pull-feedback.mjs --since 2026-01-01
 *
 * Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in env or app/.env.local.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  const envPath = resolve(__dirname, '../app/.env.local');
  if (!existsSync(envPath)) return;
  const raw = readFileSync(envPath, 'utf8');
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = val;
  }
}

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { output: null, type: null, since: null };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--output' && args[i + 1]) opts.output = args[++i];
    if (args[i] === '--type' && args[i + 1]) opts.type = args[++i];
    if (args[i] === '--since' && args[i + 1]) opts.since = args[++i];
  }
  return opts;
}

async function main() {
  loadEnv();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Add them to app/.env.local.');
    process.exit(1);
  }

  const opts = parseArgs();
  const supabase = createClient(url, key);

  let query = supabase
    .from('feedback')
    .select('id, type, message, email, page, user_id, created_at')
    .order('created_at', { ascending: false });

  if (opts.type) query = query.eq('type', opts.type);
  if (opts.since) query = query.gte('created_at', opts.since);

  const { data, error } = await query;

  if (error) {
    console.error('Supabase error:', error.message);
    process.exit(1);
  }

  const total = data?.length ?? 0;
  console.error(`Fetched ${total} feedback entries.`);

  const output = JSON.stringify(data, null, 2);

  if (opts.output) {
    writeFileSync(opts.output, output, 'utf8');
    console.error(`Saved to ${opts.output}`);
  } else {
    process.stdout.write(output + '\n');
  }
}

main();
