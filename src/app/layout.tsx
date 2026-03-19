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
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 'dark';
                  document.documentElement.setAttribute('data-theme', theme);
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })()
            `,
          }}
        />
      </head>
      <body className={`${inter.className} min-h-screen bg-background text-foreground selection:bg-cyber-blue/30 selection:text-cyber-blue`}>
        <ReduxProvider>
          <AuthProvider>
            <ProtectedRoute>
              <DashboardLayout>
                {children}
              </DashboardLayout>
            </ProtectedRoute>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
