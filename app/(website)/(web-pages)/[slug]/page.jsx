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

    const canonicalUrl = `${baseUrl}/${slug}`;

    if (!page) {
      console.log("SEO PAGE NOT FOUND");
      return {
        title: "Page Not Found - Trains Cafe",
        description: "This page is not available or unpublished.",
        robots: "noindex",
        alternates: {
          canonical: canonicalUrl,
        },
        openGraph: {
          title: "Page Not Found - Trains Cafe",
          description: "This page is not available or unpublished.",
          url: canonicalUrl,
          type: "website",
          images: [`${baseUrl}/images/meta_image.png`],
        },
        twitter: {
          card: "summary_large_image",
          title: "Page Not Found - Trains Cafe",
          description: "This page is not available or unpublished.",
          images: [`${baseUrl}/images/meta_image.png`],
        },
      };
    }

    console.log("SEO PAGE FOUND:", page);

    const safeTitle = page.title || "Trains Cafe";
    const safeDesc = page.description || "Order food online in train.";
    const safeKeywords = Array.isArray(page.keywords)
      ? page.keywords.join(", ")
      : page.keywords || "";
    const ogImage = page.ogImage || "/images/meta_image.png";

    return {
      title: safeTitle,
      description: safeDesc,
      keywords: safeKeywords,
      robots: "index, follow",
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: safeTitle,
        description: safeDesc,
        url: canonicalUrl,
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
  } catch (error) {
    console.error("SEO ERROR:", error);
    return {
      title: "Error - Trains Cafe",
      description: "Something went wrong.",
      robots: "noindex",
      alternates: {
        canonical: `${baseUrl}/${slug}`,
      },
      openGraph: {
        title: "Error - Trains Cafe",
        description: "Something went wrong.",
        url: `${baseUrl}/${slug}`,
        type: "website",
        images: [`${baseUrl}/images/meta_image.png`],
      },
      twitter: {
        card: "summary_large_image",
        title: "Error - Trains Cafe",
        description: "Something went wrong.",
        images: [`${baseUrl}/images/meta_image.png`],
      },
    };
  }
}

export default function Page({ params }) {
  return <DynamicPage params={params} />;
}
