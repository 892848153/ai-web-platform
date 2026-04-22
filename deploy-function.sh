#!/bin/bash

# Supabase Edge Function 部署脚本

echo "🚀 开始部署通义千问聊天函数到Supabase..."

# 检查Supabase CLI是否安装
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI未安装，请先安装:"
    echo "npm install -g @supabase/cli"
    exit 1
fi

# 检查登录状态
if ! supabase projects list &> /dev/null; then
    echo "📝 请先登录Supabase:"
    echo "supabase login"
    exit 1
fi

# 部署函数
echo "📦 部署qwen-chat函数..."
supabase functions deploy qwen-chat \
    --project-ref hzbrgdaudidzokewdpwz \
    --no-verify-jwt

if [ $? -eq 0 ]; then
    echo "✅ 函数部署成功！"
    echo ""
    echo "📋 部署信息:"
    echo "• 函数URL: https://hzbrgdaudidzokewdpwz.supabase.co/functions/v1/qwen-chat"
    echo "• 环境变量: 需要在Supabase控制台设置 VITE_QWEN_API_KEY"
    echo ""
    echo "🔧 测试函数:"
    echo "curl -X POST https://hzbrgdaudidzokewdpwz.supabase.co/functions/v1/qwen-chat \\"
    echo "  -H 'Content-Type: application/json' \\"
    echo "  -d '{\"model\": \"qwen-plus\", \"messages\": [{\"role\": \"user\", \"content\": \"你好\"}]}'"
else
    echo "❌ 函数部署失败"
    exit 1
fi