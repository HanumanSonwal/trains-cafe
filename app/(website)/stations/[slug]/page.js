export const dynamic = "force-dynamic";

import DynamicStationPage from "./DynamicStationPage";

export async function generateMetadata({ params }) {
  const slug = params.slug;
  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
  const pageUrl = `${baseUrl}/stations/${slug}`;

  const res = await fetch(`${baseUrl}/api/web-station/${slug}`, { cache: "no-store" });

  if (!res.ok) {
    console.error("SEO fetch failed:", res.status);
    return {
      title: `Order Food in Train | Trains Cafe`,
      description: `Get fresh food delivered at your seat.`,
      robots: "noindex",
      alternates: {
        canonical: pageUrl,
      },
      openGraph: {
        title: `Order Food in Train | Trains Cafe`,
        description: `Get fresh food delivered at your seat.`,
        url: pageUrl,
        type: "website",
        images: [`${baseUrl}/images/meta_image.png`],
      },
      twitter: {
        card: "summary_large_image",
        title: `Order Food in Train | Trains Cafe`,
        description: `Get fresh food delivered at your seat.`,
        images: [`${baseUrl}/images/meta_image.png`],
      },
    };
  }

  const data = await res.json();

  if (!data) {
    return {
      title: `Order Food in Train | Trains Cafe`,
      description: `Get fresh food delivered at your seat.`,
      robots: "noindex",
      alternates: {
        canonical: pageUrl,
      },
      openGraph: {
        title: `Order Food in Train | Trains Cafe`,
        description: `Get fresh food delivered at your seat.`,
        url: pageUrl,
        type: "website",
        images: [`${baseUrl}/images/meta_image.png`],
      },
      twitter: {
        card: "summary_large_image",
        title: `Order Food in Train | Trains Cafe`,
        description: `Get fresh food delivered at your seat.`,
        images: [`${baseUrl}/images/meta_image.png`],
      },
    };
  }

  const safeTitle = data.title || `Order Food in Train | Trains Cafe`;
  const safeDesc = data.description || "Get fresh food delivered at your train seat.";
  const ogImage = data.ogImage || "/images/meta_image.png";

  return {
    title: safeTitle,
    description: safeDesc,
    robots: "index, follow",
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: safeTitle,
      description: safeDesc,
      url: pageUrl,
      type: "website",
      images: [
        ogImage.startsWith("http")
          ? ogImage
          : `${baseUrl}${ogImage.startsWith("/") ? "" : "/"}${ogImage}`,
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: safeTitle,
      description: safeDesc,
      images: [
        ogImage.startsWith("http")
          ? ogImage
          : `${baseUrl}${ogImage.startsWith("/") ? "" : "/"}${ogImage}`,
      ],
    },
  };
}

export default async function Page({ params }) {
  const slug = params.slug;
  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/web-station/${slug}`, { cache: "no-store" });
  const data = await res.json();

  return <DynamicStationPage data={data} />;
}
