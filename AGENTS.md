# Repository Guidelines

本指南为贡献者提供 plum-blossom-divination 项目的关键协作规范，帮助快速理解代码布局、开发命令与质量要求，确保贡献能够顺利合并。

## 项目结构与模块组织
- `src/app`：Next.js App Router 入口，`page.tsx` 管理页面骨架，`layout.tsx` 负责全局结构与样式注入。
- `src/components`：复用 UI 组件，包括卦象表单与展示面板，建议按功能拆分文件并维持无状态逻辑。
- `src/lib`：核心梅花易数算法与基础数据；新增算法时请保持纯函数便于测试。
- `src/contexts` 与 `src/types`：上下文状态与 TypeScript 类型定义；扩展类型时同步维持 `@/` 路径别名。
- `public`：静态资源与图标；生产构建会自动复制到 `.next`。

## 构建、测试与开发命令
- `npm install`：安装依赖，首次克隆后执行。
- `npm run dev`：本地开发服务器（Turbopack），包含热更新。
- `npm run build`：生成生产构建，提交前用于验证。
- `npm run start`：在本地预览生产包。
- `npm run lint`：运行 ESLint，确保遵循 Next.js `core-web-vitals` 规则。

## 代码风格与命名约定
遵循 TypeScript 严格模式，保持 2 空格缩进与单引号字符串。组件与 Hook 采用 PascalCase、`use` 前缀；工具函数、常量使用 camelCase 与 UPPER_SNAKE_CASE。Tailwind 样式集中保留在 JSX className 内，避免内联 style。提交前运行 `npm run lint` 并确保无未使用导入。

## 测试指南
当前仓库未集成自动化测试；新增功能时优先为 `src/lib` 编写轻量单元测试（推荐 Vitest 或 Jest）并放置于 `__tests__` 目录。至少手动验证主要起卦流程：时间、数字与随机模式，在桌面与移动视口下检查 UI。

## 提交与 Pull Request 要求
采用祈使语的英文提交摘要（例如 `Add time based seed helper`），正文说明动机与影响。PR 描述需概述变更、列出测试步骤，并在适用时附上截图或动图。若关联 Issue，请在描述中以 `Closes #id` 标记，确保评审人员能复现与验证改动。

## 配置与运行提示
环境变量目前无需配置；若未来引入后端服务，请提供 `.env.example`。部署推荐 Vercel，合并前使用 `npm run build` 验证通过，并关注 ESLint 对无障碍与性能的提示。
