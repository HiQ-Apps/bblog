import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { SanityLive } from "@/sanity/the-good-standard/lib/live";

import Script from "next/script";
import { SidebarProvider } from "@/components/ui/sidebar";
import type { Metadata } from "next";
import { Montserrat, Playfair_Display, Lora } from "next/font/google";
import "./globals.css";

import AppSidebar from "@/components/composite/appSidebar";
import MobileNavbar from "@/components/composite/mobileNavMenu";
import HomeBanner from "@/components/composite/logoBanner";

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
  icons: { icon: "/LOGO.png" },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isEnabled } = await draftMode();

  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-8FK103BLYZ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-8FK103BLYZ');
          `}
        </Script>
      </head>
      <body
        className={`${montserrat.variable} ${playfair.variable} ${lora.variable} bg-primary antialiased`}
      >
        <SidebarProvider defaultOpen>
          <div className="flex w-full flex-col items-center">
            <HomeBanner />
            {/* Mobile nav only on screens < md */}
            <div className="w-full flex justify-center items-center md:hidden">
              <MobileNavbar />
            </div>
            <div className="flex w-full flex-row relative">
              {/* Hide sidebar on small screens, show ≥ md */}
              <div className="hidden md:block">
                <AppSidebar />
              </div>
              {children}
            </div>
          </div>
          {isEnabled && <VisualEditing />}
        </SidebarProvider>
        <SanityLive />
      </body>
    </html>
  );
}
