// app/all-products/page.jsx

import AllProductsClient from "./AllProductsClient";

export const metadata = {
  title: "Shop Pure & Raw Honey Online | Motherland Pure",
  description: "Shop premium quality pure honey online. Acacia, Jamun, Forest, Himalayan, Sunderban, Tulsi & Multiflora honey. Natural, raw and unprocessed.",
  openGraph: {
    title: "Shop Pure & Raw Honey Online | Motherland Pure",
    description: "Shop premium quality pure honey online. Acacia, Jamun, Forest, Himalayan, Sunderban, Tulsi & Multiflora honey. Natural, raw and unprocessed.",
    type: "website",
    images: [
      {
        url: "/LogoR.webp",
        width: 1200,
        height: 630,
        alt: "Motherland Honey Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop Pure & Raw Honey Online | Motherland Pure",
    description: "Shop premium quality pure honey online. Acacia, Jamun, Forest, Himalayan, Sunderban, Tulsi & Multiflora honey. Natural, raw and unprocessed.",
    images: ["/LogoR.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AllProductsPage() {
  return <AllProductsClient />;
}