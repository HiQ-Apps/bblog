import { SidebarProvider } from "@/components/ui/sidebar";
import type { Metadata } from "next";
import { Montserrat, Playfair_Display, Lora } from "next/font/google";
import "./globals.css";

import AppSidebar from "@/components/composite/appSidebar";
import HomeBanner from "@/components/composite/homeBanner";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "700"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["400", "700"],
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "The Good Standard",
  description: "A blog about the things that make life good.",
  icons: {
    icon: "/LOGO.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${playfair.variable} ${lora.variable} bg-primary antialiased`}
      >
        <SidebarProvider defaultOpen={true}>
          {/* {<MobileNavbar />} */}
          <div className="flex w-full flex-col items-center">
            <HomeBanner />
            <div className="flex w-full flex-row relative">
              <AppSidebar />
              {children}
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
