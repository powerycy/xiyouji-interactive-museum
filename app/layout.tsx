import type { Metadata } from "next";
import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";
import "@photo-sphere-viewer/virtual-tour-plugin/index.css";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "西游镜界｜原著证据驱动的 AI 360°互动博物馆",
  description: "从可核对的《西游记》原文出发，走进白虎岭 360°场景，完成证据展签、真相时间线与奖励闭环。",
  openGraph: {
    title: "西游镜界｜原著证据驱动的 AI 360°互动博物馆",
    description: "原著证据、360°场景、互动推理与可选的多模态文化导览。",
    type: "website",
    locale: "zh_CN",
    images: [
      {
        url: "/assets/hackathon2026/xiyou-mirror-cover-v1.png",
        width: 1080,
        height: 1080,
        alt: "西游镜界"
      }
    ]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
