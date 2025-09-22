# 梅花易数起卦工具

一个基于React和Next.js开发的梅花易数占卜工具，实现了传统易学的起卦方法。

## 功能特点

### 🎯 多种起卦方式
- **时间起卦**：根据年月日时数字进行起卦
- **数字起卦**：输入任意数字组合起卦
- **随机起卦**：系统自动生成随机卦象

### 📚 完整的易学体系
- 八卦基础数据（乾、兑、离、震、巽、坎、艮、坤）
- 六十四卦象系统
- 动爻计算和变卦推导
- 传统卦辞和象辞解释

### 🎨 现代化界面
- 响应式设计，支持手机和桌面端
- 直观的卦象可视化显示
- 清晰的动爻标识
- 优雅的渐变背景

## 技术栈

- **框架**：Next.js 15 (App Router)
- **语言**：TypeScript
- **样式**：Tailwind CSS
- **构建**：Turbopack

## 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本
```bash
npm run build
npm start
```

## 使用方法

### 时间起卦
1. 选择"时间起卦"模式
2. 设置年、月、日、时（可使用当前时间）
3. 点击"开始起卦"
4. 查看主卦、动爻和变卦结果

### 数字起卦
1. 选择"数字起卦"模式
2. 输入至少两个数字，用逗号分隔
3. 点击"开始起卦"
4. 系统根据数字计算卦象

### 随机起卦
1. 选择"随机起卦"模式
2. 直接点击"开始起卦"
3. 系统随机生成卦象

## 项目结构

```
src/
├── app/
│   └── page.tsx          # 主页面
├── components/
│   ├── DivinationForm.tsx # 起卦表单
│   ├── HexagramDisplay.tsx # 卦象显示
│   └── ResultPanel.tsx    # 结果面板
├── lib/
│   ├── divination.ts      # 起卦算法
│   ├── hexagrams.ts       # 六十四卦数据
│   └── trigrams.ts        # 八卦数据
└── types/
    └── index.ts          # TypeScript类型定义
```

## 梅花易数算法

### 起卦公式
- **上卦** = (年 + 月 + 日) ÷ 8 的余数
- **下卦** = (年 + 月 + 日 + 时) ÷ 8 的余数
- **动爻** = (年 + 月 + 日 + 时) ÷ 6 的余数

### 八卦对应
1. 乾 ☰ - 天
2. 兑 ☱ - 泽
3. 离 ☲ - 火
4. 震 ☳ - 雷
5. 巽 ☴ - 风
6. 坎 ☵ - 水
7. 艮 ☶ - 山
8. 坤 ☷ - 地

## 开发计划

- [ ] 完善六十四卦的详细解释
- [ ] 添加卦象查询功能
- [ ] 实现占卜历史记录
- [ ] 添加更多起卦方式
- [ ] 优化移动端体验
- [ ] 添加音效和动画

## 部署

推荐使用 [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) 部署应用。

查看 [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) 了解更多部署详情。

## 贡献

欢迎提交Issue和Pull Request来改进这个项目。

## 许可证

MIT License
