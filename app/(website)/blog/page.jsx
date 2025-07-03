import BlogPageClient from "./BlogPageClient";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const baseTitle = "Blogs - Trains Cafe";
  const baseDescription = "Read our latest blogs about train food delivery, travel tips and more.";

  return {
    title: baseTitle,
    description: baseDescription,
    keywords: "train food blog, IRCTC food, railway travel tips",
    openGraph: {
      title: baseTitle,
      description: baseDescription,
      url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/blog`,
    },
  };
}

export default function BlogPage() {
  return <BlogPageClient />;
}
