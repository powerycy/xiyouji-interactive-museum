import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "西游记互动博物馆",
  description: "原著还原型互动博物馆 MVP"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
