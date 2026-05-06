#!/bin/bash

# 腾讯云静态网站部署脚本

echo "=== AI启航平台腾讯云部署脚本 ==="

# 检查是否安装了云开发 CLI
if ! command -v tcb &> /dev/null; then
    echo "安装腾讯云开发 CLI..."
    npm install -g @cloudbase/cli
fi

# 构建项目
echo "构建项目..."
npm run build

if [ $? -ne 0 ]; then
    echo "构建失败，请检查错误"
    exit 1
fi

echo "构建成功！"

# 登录腾讯云
echo "请登录腾讯云账号..."
tcb login

# 初始化项目（如果是第一次）
if [ ! -f ".cloudbaserc.json" ]; then
    echo "初始化云开发项目..."
    tcb init --without-template
fi

# 部署静态网站
echo "部署到腾讯云..."
tcb hosting deploy ./dist

echo "部署完成！"
echo "访问地址将在部署完成后显示"