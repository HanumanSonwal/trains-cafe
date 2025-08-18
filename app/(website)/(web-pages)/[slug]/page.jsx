export const dynamic = "force-dynamic";
export const revalidate = 60;

import DynamicPage from "./DynamicPage";

const BASE_URL = process.env.NEXT_PUBLIC_URL || "https://trainscafe.in";

async function getPageData(slug) {
  try {
    const res = await fetch(`${BASE_URL}/api/web-pages?slug=${slug}`, {
      cache: "force-cache",
      next: { revalidate },
    });

    if (!res.ok) return { page: null };

    const data = await res.json();
    const page =
      (data?.docs || []).find(
        (p) => p.slug === slug && p.status === "published"
      ) || null;

    if (!page) return { page: null };

    const rawHtml = page.pageData || "<p>No content available.</p>";
    const plainText = rawHtml
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const previewLength = 300;
    const shouldTruncate =
      plainText.length > previewLength &&
      !["stations", "trains"].includes(slug);

    const truncatedText = shouldTruncate
      ? plainText.slice(0, previewLength) + "..."
      : plainText;

    return {
      page,
      baseUrl: BASE_URL,
      canonicalUrl: `${BASE_URL}/${slug}`,
      previewHtml: `<p>${truncatedText}</p>`,
      shouldTruncate,
    };
  } catch (err) {
    console.error("getPageData error:", err);
    return { page: null };
  }
}

export async function generateMetadata({ params }) {
  const slug = params.slug;
  const { page, canonicalUrl } = await getPageData(slug);

  if (!page) {
    return {
      title: "Page Not Found - Trains Cafe",
      description: "This page is not available or unpublished.",
      robots: "noindex",
      alternates: { canonical: canonicalUrl || `${BASE_URL}/${slug}` },
    };
  }

  const ogImage = page.ogImage || "/images/meta_image.png";
  const safeKeywords = Array.isArray(page.keywords)
    ? page.keywords.join(", ")
    : page.keywords || "";

  return {
    title: page.title || "Trains Cafe",
    description: page.description || "Order food online in train.",
    keywords: safeKeywords,
    robots: "index, follow",
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: page.title,
      description: page.description,
      url: canonicalUrl,
      type: "website",
      images: [ogImage.startsWith("http") ? ogImage : `${BASE_URL}${ogImage}`],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [ogImage.startsWith("http") ? ogImage : `${BASE_URL}${ogImage}`],
    },
  };
}

export async function generateStaticParams() {
  try {
    const res = await fetch(`${BASE_URL}/api/web-pages`, {
      cache: "force-cache",
      next: { revalidate: 300 },
    });

    if (!res.ok) return [];
    const data = await res.json();

    return (data.docs || [])
      .filter((p) => p.status === "published")
      .map((p) => ({ slug: p.slug }));
  } catch (err) {
    console.error("generateStaticParams error:", err);
    return [];
  }
}

export default async function Page({ params }) {
  const slug = params.slug;
  const { page, baseUrl, canonicalUrl, previewHtml, shouldTruncate } =
    await getPageData(slug);

  if (!page) {
    return (
      <DynamicPage
        page={null}
        slug={slug}
        previewHtml={null}
        shouldTruncate={false}
      />
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.title || `Trains Cafe`,
    description: page.description || "Order food online in train.",
    url: canonicalUrl,
    keywords: Array.isArray(page.keywords)
      ? page.keywords.join(", ")
      : page.keywords || "",
    publisher: {
      "@type": "Organization",
      name: "Trains Cafe",
      url: baseUrl,
      logo: { "@type": "ImageObject", url: `${baseUrl}/images/meta_image.png` },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DynamicPage
        page={page}
        slug={slug}
        previewHtml={previewHtml}
        shouldTruncate={shouldTruncate}
      />
    </>
  );
}
