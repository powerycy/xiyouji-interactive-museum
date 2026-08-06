import Link from "next/link";
import type { ReactNode } from "react";

export function AppFrame({ children, variant = "default" }: { children: ReactNode; variant?: "default" | "museum-light" }) {
  return (
    <div className={`app-bg ${variant === "museum-light" ? "app-bg-museum-light" : ""}`}>
      <header className="topbar">
        <Link href="/" className="brand">
          西游记互动博物馆
        </Link>
        <nav className="nav-links" aria-label="主导航">
          <Link href="/">大地图</Link>
          <Link href="/chapter/027">白虎岭</Link>
          <Link href="/studio">Studio</Link>
        </nav>
      </header>
      {children}
    </div>
  );
}
