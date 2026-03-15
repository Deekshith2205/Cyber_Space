import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import DashboardLayout from "@/components/dashboard-layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CYBERSPACE | Cybersecurity Command Center",
  description: "Next-generation AI cybersecurity platform for monitoring, scanning, and incident reporting.",
  icons: {
    icon: "/cyberspacefavicon.jpeg",
  },
};

import { ReduxProvider } from "@/components/redux-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-[#0B0F14] text-white selection:bg-cyber-blue/30 selection:text-cyber-blue`}>
        <ReduxProvider>
          <DashboardLayout>
            {children}
          </DashboardLayout>
        </ReduxProvider>
      </body>
    </html>
  );
}
