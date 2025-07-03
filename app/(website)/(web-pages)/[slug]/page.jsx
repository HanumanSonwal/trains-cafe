import DynamicPage from "./DynamicPage";

export async function generateMetadata({ params }) {
  const slug = params.slug;
  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

  console.log("SEO CALL:", `${baseUrl}/api/web-pages?slug=${slug}`);

  try {
    const res = await fetch(`${baseUrl}/api/web-pages?slug=${slug}`, {
      cache: "no-store",
    });

    console.log("SEO STATUS:", res.status);

    if (!res.ok) {
      console.log("SEO API FAILED");
      throw new Error(`Fetch failed: ${res.status}`);
    }

    const data = await res.json();
    console.log("SEO DATA:", data);

    const page = data.docs.find(
      (page) => page.slug === slug && page.status === "published"
    );

    if (!page) {
      console.log("SEO PAGE NOT FOUND");
      return {
        title: "Page Not Found - Trains Cafe",
        description: "This page is not available or unpublished.",
        robots: "noindex",
      };
    }

    console.log("SEO PAGE FOUND:", page);

    return {
      title: page.title || "Trains Cafe",
      description: page.description || "Order food online in train.",
      keywords: Array.isArray(page.keywords)
        ? page.keywords.join(", ")
        : page.keywords,
      openGraph: {
        title: page.title,
        description: page.description,
        url: `${baseUrl}/${slug}`,
      },
    };
  } catch (error) {
    console.error("SEO ERROR:", error);
    return {
      title: "Error - Trains Cafe",
      description: "Something went wrong.",
      robots: "noindex",
    };
  }
}

export default function Page({ params }) {
  return <DynamicPage params={params} />;
}
