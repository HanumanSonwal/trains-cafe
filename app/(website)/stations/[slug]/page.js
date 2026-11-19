// The page HTML is cached and refreshed every 5 minutes (kitchen lists load live in the browser).
export const revalidate = 300;

import { parseStationSlug } from "@/utils/slugify";
import { getWebStation } from "@/app/lib/siteContent";
import DynamicStationPage from "./DynamicStationPage";

export async function generateMetadata({ params }) {
  const { data, baseUrl, pageUrl, stationName } = await getStationData(
    params.slug
  );

  if (!data) {
    return defaultMeta(pageUrl, baseUrl, stationName);
  }

  const safeTitle =
    data.title || `Food in Train at ${stationName} | Trainscafe Food Delivery`;

  const safeDesc =
    data.description ||
    `Order fresh & hygienic food in train at ${stationName}. Enjoy fast delivery at your seat.`;

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

// Read straight from the database (cached), not over HTTP from our own API.
async function getStationData(slug) {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
  const pageUrl = `${baseUrl}/stations/${slug}`;
  const { stationName, stationCode } = parseStationSlug(slug);

  try {
    const data = await getWebStation(stationCode);
    return { data, baseUrl, pageUrl, stationName };
  } catch (e) {
    console.error("Station page content failed:", e.message);
    return { data: null, baseUrl, pageUrl, stationName };
  }
}

function defaultMeta(pageUrl, baseUrl, stationName) {
  const title = `Food in Train at ${stationName} | Trainscafe Food Delivery`;
  const description = `Order fresh & hygienic food in train at ${stationName}. Enjoy fast delivery at your seat.`;
  const image = `${baseUrl}/images/meta_image.png`;

  return {
    title,
    description,
    keywords: "order food in train, train food delivery, Trains Cafe",
    robots: "noindex",
    alternates: { canonical: pageUrl },

    openGraph: {
      title,
      description,
      url: pageUrl,
      type: "website",
      images: [image],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

function formatImageUrl(image, baseUrl) {
  return image.startsWith("http")
    ? image
    : `${baseUrl}${image.startsWith("/") ? "" : "/"}${image}`;
}
