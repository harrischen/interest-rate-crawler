#!/bin/bash

# 确保使用 Node.js v18
echo "Switching to Node.js v18..."
source ~/.nvm/nvm.sh  # 加载 nvm
nvm use v18

# 运行爬虫脚本
echo "Running crawler..."
npm run build:crawler

# Git 操作
echo "Committing changes..."
current_date=$(date +%Y%m%d)
git add .
git commit -m "feat: 更新${current_date}利率"

# 推送到远程仓库
echo "Pushing to remote repository..."
git push origin main

echo "Update completed successfully!" 