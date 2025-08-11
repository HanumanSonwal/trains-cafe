export const dynamic = "force-dynamic";

import DynamicStationPage from "./DynamicStationPage";

export async function generateMetadata({ params }) {
  const { data, baseUrl, pageUrl } = await getStationData(params.slug);

  if (!data) {
    return defaultMeta(pageUrl, baseUrl);
  }

  const safeTitle = data.title || `Order Food in Train | Trains Cafe`;
  const safeDesc = data.description || "Get fresh food delivered at your train seat.";
  const safeKeywords = Array.isArray(data.keywords)
    ? data.keywords.join(", ")
    : data.keywords || "order food in train, train food delivery, Trains Cafe";
  const ogImage = data.ogImage || "/images/meta_image.png";

  return {
    title: safeTitle,
    description: safeDesc,
    keywords: safeKeywords,
    robots: "index, follow",
    alternates: { canonical: pageUrl },
    openGraph: {
      title: safeTitle,
      description: safeDesc,
      url: pageUrl,
      type: "website",
      images: [formatImageUrl(ogImage, baseUrl)],
    },
    twitter: {
      card: "summary_large_image",
      title: safeTitle,
      description: safeDesc,
      images: [formatImageUrl(ogImage, baseUrl)],
    },
  };
}

export default async function Page({ params }) {
  const { data } = await getStationData(params.slug);
  return <DynamicStationPage slug={params.slug} serverData={data} />;
}

async function getStationData(slug) {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
  const pageUrl = `${baseUrl}/stations/${slug}`;

  try {
    const res = await fetch(`${baseUrl}/api/web-station/${slug}`, {
      cache: "no-store", 
    });
    if (!res.ok) return { data: null, baseUrl, pageUrl };

    const data = await res.json();
    return { data, baseUrl, pageUrl };
  } catch {
    return { data: null, baseUrl, pageUrl };
  }
}

function defaultMeta(pageUrl, baseUrl) {
  return {
    title: `Order Food in Train | Trains Cafe`,
    description: `Get fresh food delivered at your seat.`,
    keywords: "order food in train, train food delivery, Trains Cafe",
    robots: "noindex",
    alternates: { canonical: pageUrl },
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

function formatImageUrl(image, baseUrl) {
  return image.startsWith("http")
    ? image
    : `${baseUrl}${image.startsWith("/") ? "" : "/"}${image}`;
}
