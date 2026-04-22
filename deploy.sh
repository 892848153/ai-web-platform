#!/bin/bash

# Simple deployment script for AI Web Platform

echo "🚀 Deploying AI Web Platform..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Build the project
echo "🔨 Building project..."
npm run build

# Deploy to Vercel
echo "☁️ Deploying to Vercel..."
vercel --prod --confirm

echo "✅ Deployment complete!"