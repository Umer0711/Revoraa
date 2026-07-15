#!/bin/bash
# setup_secrets.sh
# Push local .env variables as secrets to your Supabase project's Edge Functions.

echo "Setting up Supabase Edge Function Secrets..."

if [ ! -f .env ]; then
  echo "Error: .env file not found in the current directory."
  exit 1
fi

echo "Pushing secrets to Supabase..."
npx supabase secrets set --env-file .env

echo "Secrets successfully pushed! Your Edge Functions (create-order, verify-payment, send-email) will now be able to read these environment variables."
