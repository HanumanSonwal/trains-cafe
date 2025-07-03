export const dynamic = "force-dynamic";

import DynamicStationPage from "./DynamicStationPage";

export async function generateMetadata({ params }) {
  const slug = params.slug;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/web-station/${slug}`, { cache: "no-store" });

  if (!res.ok) {
    console.error("SEO fetch failed:", res.status);
    return {
      title: `Order Food in Train | Trains Cafe`,
      description: `Get fresh food delivered at your seat.`,
    };
  }

  const data = await res.json();

  if (!data) {
    return {
      title: `Order Food in Train | Trains Cafe`,
      description: `Get fresh food delivered at your seat.`,
    };
  }

  return {
    title: data.title || `Order Food in Train | Trains Cafe`,
    description: data.description || "",
    openGraph: {
      title: data.title,
      description: data.description,
    },
  };
}

export default async function Page({ params }) {
  const slug = params.slug;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/web-station/${slug}`, { cache: "no-store" });
  const data = await res.json();

  return <DynamicStationPage data={data} />;
}
