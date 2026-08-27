import CheckoutContent from "./checkoutContent";

export const metadata = {
  title: "Checkout | Anaaj – Secure Payment",
  description:
    "Complete your Anaaj order. Secure checkout with UPI, cards & net banking. Fast delivery across India.",
  openGraph: {
    title: "Secure Checkout – Anaaj",
    description: "Complete your purchase with secure payment options.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Checkout | Anaaj",
    description: "Secure payment – complete your order.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutPage() {
  return <CheckoutContent />;
}