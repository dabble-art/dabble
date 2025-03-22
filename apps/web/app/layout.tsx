import { Geist, Geist_Mono } from "next/font/google";

import "@workspace/ui/globals.css";
import { Providers } from "@/components/providers";
import ReactQueryProvider from "@/components/react-query-provider";
import { SidebarProvider } from "@workspace/ui/components/sidebar";
import { SidebarInset } from "@workspace/ui/components/sidebar";
import { AppSidebar } from "@workspace/ui/components/app-sidebar";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <ReactQueryProvider>
          <Providers>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>{children}</SidebarInset>
            </SidebarProvider>
          </Providers>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
