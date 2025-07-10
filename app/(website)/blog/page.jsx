import BlogPageClient from "./BlogPageClient";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
  const pageUrl = `${baseUrl}/blog`;

  const baseTitle = "Blogs - Trains Cafe";
  const baseDescription =
    "Read our latest blogs about train food delivery, travel tips and more.";

  return {
    title: baseTitle,
    description: baseDescription,
    keywords: "train food blog, IRCTC food, railway travel tips",
    robots: "index, follow",
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: baseTitle,
      description: baseDescription,
      url: pageUrl,
      type: "website",
      images: [`${baseUrl}/images/meta_image.png`],
    },
    twitter: {
      card: "summary_large_image",
      title: baseTitle,
      description: baseDescription,
      images: [`${baseUrl}/images/meta_image.png`],
    },
  };
}

export default function BlogPage() {
  return <BlogPageClient />;
}
