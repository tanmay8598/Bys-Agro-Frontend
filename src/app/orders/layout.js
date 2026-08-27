export const metadata = {
  title: "My Orders | Anaaj",
  description:
    "View and manage your order history, track shipments, and download invoices on Anaaj.",
  robots: "noindex, follow",
  openGraph: {
    title: "My Orders | Anaaj",
    description: "Track your purchases and order status on Anaaj.",
    type: "website",
    images: [
      {
        url: "/LogoR.webp",
        width: 1200,
        height: 630,
        alt: "Anaaj Orders Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "My Orders | Anaaj",
    description: "Track your purchases and order status.",
    images: ["/LogoR.webp"],
  },
};

export default function OrdersLayout({ children }) {
  return <>{children}</>;
}