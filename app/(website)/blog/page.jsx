import BlogPageClient from "./BlogPageClient";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
  const pageUrl = `${baseUrl}/blog`;

  const baseTitle = "All Train Blogs, Travel Tips & Railway Guides | Trainscafe";
  const baseDescription =
    "Read train travel blogs on trainscafe covering railway tips, station guides, train food, journey experiences, and Indian Railways travel updates for passengers.";

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
