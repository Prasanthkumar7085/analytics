"use client";
import { Providers } from "@/Redux/Provider";
import NavBar from "@/components/NavBar";
import type { Metadata } from "next";
import { usePathname } from "next/navigation";
import "./index.css";
import "./globals.css";
import "../scss/app.scss";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body>
        <Providers>
          {pathname == "/signin" ? children : <NavBar>{children}</NavBar>}
        </Providers>
      </body>
    </html>
  );
}
