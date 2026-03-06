# Airwave

AI 生成类项目，部署在 airwave.ning.codes。

## Tech Stack

- React 19 + TypeScript + Vite + TailwindCSS（npm 版，含 postcss + autoprefixer）
- Google Gemini AI（`@google/genai`）
- ESLint

## 常用命令

```bash
npm run dev     # Vite dev server
npm run build   # tsc -b && vite build
npm run lint    # ESLint
```

## 项目结构

`src/` 布局：

- `api/generate.ts` — Gemini 生成 API（maxDuration: 120s，最长的 function）
