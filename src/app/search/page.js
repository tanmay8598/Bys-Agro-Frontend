import SearchClient from "./SearchClient";

export const metadata = {
  title: "Search Products | Bys Agro",
  description:
    "Search honey, oils, spices, and more from our exclusive organic collection. Find the right product for you.",
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Search Products | Bys Agro",
    description: "Browse and search our full range of pure, natural products.",
    type: "website",
    images: ["/LogoR.webp"],
  },
  twitter: {
    card: "summary",
    title: "Search Products | Bys Agro",
    description: "Find pure, natural products at Bys Agro.",
    images: ["/LogoR.webp"],
  },
};

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const query = params?.q || "";

  return <SearchClient initialQuery={query} />;
}
