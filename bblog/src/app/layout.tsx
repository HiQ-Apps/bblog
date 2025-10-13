import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SidebarProvider } from "@/components/ui/sidebar";
import type { Metadata } from "next";
import { Montserrat, Playfair_Display, Lora } from "next/font/google";
import "./globals.css";

import {
  SITE_NAME,
  SITE_URL,
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
} from "@/lib/seo";
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
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    type: "website",
    title: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    siteName: SITE_NAME,
    images: [DEFAULT_OG_IMAGE],
  },
  icons: { icon: "/LOGO.png" },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="p:domain_verify"
          content="e1aca7c406dc455725e10268ffc8105a"
        />
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
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3628542699195263"
          crossOrigin="anonymous"
        ></script>
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

            <main
              id="main-content"
              className="flex w-full flex-row relative"
              role="main"
            >
              {/* Hide sidebar on small screens, show ≥ md */}
              <div className="hidden md:block">
                <AppSidebar />
              </div>
              {children}
            </main>
          </div>
        </SidebarProvider>

        {/* Sitewide JSON-LD */}
        <Script
          id="ld-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: SITE_NAME,
              url: SITE_URL,
            }),
          }}
        />
        <Script
          id="ld-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: SITE_NAME,
              url: SITE_URL,
              logo: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
            }),
          }}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
