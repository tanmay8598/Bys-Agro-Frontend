import { Figtree } from "next/font/google";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";
import ClientOnly from "./../components/ClientsOnly/ClientsOnly";
import "./globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_CLIENT || "http://localhost:3000",
  ),
  title:
    "Motherland Pure – Raw Honey & Herbal Teas | No Additives, Pure Indian",
  description:
    "Shop raw honey (Acacia, Himalayan, Tulsi, Jamun, Forest, Sundarban) and herbal teas (Blue Tea, Hibiscus, Kashmiri Kahwa, Turmeric, Moringa, Apple Cinnamon) at Motherland Pure. FSSAI approved. No additives. Delivered pan-India.",
  keywords: [
    "Motherland Pure",
    "raw honey online India",
    "buy pure honey",
    "herbal tea online India",
    "blue tea buy online",
    "kashmiri kahwa online",
    "hibiscus tea India",
    "Himalayan honey",
    "Tulsi honey",
    "turmeric green tea",
    "moringa tea online",
    "apple cinnamon tea",
    "Jamun honey",
    "Forest honey",
    "Sundarban honey",
    "caffeine free herbal tea",
    "FSSAI approved honey",
    "Ardvera Naturals",
  ],
  icons: {
    icon: "/Icon512.png",
  },
  openGraph: {
    title: "Motherland Pure – Raw Honey & Herbal Teas",
    description:
      "6 raw honey varieties. 6 herbal teas. No additives, no processing. Sourced from Indian forests and tea estates.",
    url: "https://motherlandpure.com",
    siteName: "Motherland Pure",
    images: [
      {
        url: "/icons/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "Motherland Pure – Raw Honey & Herbal Tea Collection",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Motherland Pure – Raw Honey & Herbal Teas",
    description:
      "6 raw honeys + 6 herbal teas. Pure, natural, FSSAI approved. No additives. Pan-India delivery.",
    images: ["/icons/og-home.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  other: {
    fast2sms: "pIYyy9zgn0hybWArrmG8radveq7xgP4P",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={figtree.variable}>
      <body>
        <Suspense fallback={null}>
          <ClientOnly>{children}</ClientOnly>
        </Suspense>
        <Toaster position="bottom-right" reverseOrder={false} />
      </body>
    </html>
  );
}
