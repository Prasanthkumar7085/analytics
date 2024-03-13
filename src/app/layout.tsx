"use client";
import { Providers } from "@/Redux/Provider";
import NavBar from "@/components/NavBar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import "./globals.css";
import "../scss/app.scss";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Labsquire Analytics",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {pathname == "/signin" ? children : <NavBar>{children}</NavBar>}
        </Providers>
      </body>
    </html>
  );
}
