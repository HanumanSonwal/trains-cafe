import SingleBlogClient from "./SingleBlogClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const slug = params.slug;
  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
  const pageUrl = `${baseUrl}/blog/${slug}`;

  try {
    const res = await fetch(`${baseUrl}/api/blog?slug=${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Failed to fetch blog: ${res.status}`);

    const data = await res.json();
    const blog = data?.docs?.[0];

    if (!blog) {
      return {
        title: "Blog Not Found - Trains Cafe",
        description: "No blog found for this URL.",
        robots: "noindex",
        alternates: { canonical: pageUrl },
      };
    }

    const safeTitle = blog.metatitle || blog.title || "Trains Cafe Blog";
    const safeDesc =
      blog.metadescription ||
      blog.description ||
      "Latest train food, IRCTC tips & travel blogs.";
    const safeKeywords =
      blog.metakeyword ||
      "train food, IRCTC food, railway catering, travel blogs";
    const ogImage = blog.ogImage || "/images/meta_image.png";

    const imageUrl = ogImage.startsWith("http")
      ? ogImage
      : `${baseUrl}${ogImage.startsWith("/") ? "" : "/"}${ogImage}`;

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
        type: "article",
        publishedTime: blog.createdAt,
        modifiedTime: blog.updatedAt,
        images: [imageUrl],
      },
      twitter: {
        card: "summary_large_image",
        title: safeTitle,
        description: safeDesc,
        images: [imageUrl],
      },
    };
  } catch (err) {
    console.error("Metadata fetch error:", err);
    return {
      title: "Error - Trains Cafe",
      description: "Something went wrong.",
      robots: "noindex",
      alternates: { canonical: pageUrl },
    };
  }
}

export default async function Page({ params }) {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${baseUrl}/api/blog?slug=${params.slug}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Blog not found");

    const data = await res.json();
    const blog = data?.docs?.[0] || null;

    return <SingleBlogClient blog={blog} />;
  } catch (err) {
    console.error("Page fetch error:", err);
    return <div className="p-6 text-center">Error loading blog...</div>;
  }
}
