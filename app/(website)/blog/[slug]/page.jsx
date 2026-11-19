import SingleBlogClient from "./SingleBlogClient";
import { getBlog, getRelatedBlogs } from "@/app/lib/siteContent";

// Cached HTML, refreshed every 5 minutes; read from the database directly (no self-HTTP).
export const revalidate = 300;

export async function generateMetadata({ params }) {
  const slug = params.slug;
  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
  const pageUrl = `${baseUrl}/blog/${slug}`;

  try {
    const blog = await getBlog(slug);

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
  try {
    const blog = await getBlog(params.slug);
    const relatedPosts = blog ? await getRelatedBlogs(blog.category, blog.slug).catch(() => []) : [];
    return <SingleBlogClient blog={blog} relatedPosts={relatedPosts} />;
  } catch (err) {
    console.error("Blog page failed:", err.message);
    return <div className="p-6 text-center">Error loading blog...</div>;
  }
}
