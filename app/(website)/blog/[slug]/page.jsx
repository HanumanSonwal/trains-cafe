// "use client";
// import { useEffect, useState } from "react";
// import { Card } from "antd";
// import dayjs from "dayjs";

// const { Meta } = Card;

// const BlogPost = ({ params }) => {
//   const { slug } = params;
//   const [blogPost, setBlogPost] = useState(null);

//   useEffect(() => {
//     if (!slug) return;

//     const fetchBlogPost = async () => {
//       try {
//         const response = await fetch(`/api/blog?slug=${slug}`);
//         const data = await response.json();
//         setBlogPost(data.docs[0]);
//       } catch (error) {
//         console.error("Error fetching blog post:", error);
//       }
//     };

//     fetchBlogPost();
//   }, [slug]);

//   if (!blogPost) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div >
//       <Card
//         cover={
//           <img
//             alt={blogPost.title}
//             src={blogPost.image}
//             className="object-cover w-full h-40 max-w-full"
//           />
//         }
//         className="shadow-lg rounded-lg"
//       >
//         <Meta
//           title={blogPost.title}
//           description={`Published on ${dayjs(blogPost.updatedAt).format("DD MMM YYYY")}`}
//         />
//         <div
//           className="mt-4 text-gray-700 leading-relaxed"
//           dangerouslySetInnerHTML={{ __html: blogPost.content }}
//         />
//       </Card>

//       <style jsx global>{`
//         .ck-content {
//           {/* overflow-x: auto; */}
//           font-size: 1rem;
//         }

//         .ck-content table {
//           width: 100%;
//           border-collapse: collapse;
//           margin: 1rem 0;
//         }

//         .ck-content th,
//         .ck-content td {
//           border: 1px solid #ddd;
//           padding: 0.75rem;
//           text-align: left;
//         }

//         .ck-content th {
//           background-color: #f5f5f5;
//           font-weight: bold;
//         }

//         .ck-content tr:nth-child(even) {
//           background-color: #fafafa;
//         }

//         .ck-content tr:hover {
//           background-color: #f0f0f0;
//         }

//         @media (max-width: 768px) {
//           .ck-content th,
//           .ck-content td {
//             font-size: 0.875rem;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default BlogPost;


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

    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status}`);
    }

    const data = await res.json();
    const blog = data.docs[0];

    if (!blog) {
      return {
        title: "Blog Not Found - Trains Cafe",
        description: "No blog found for this URL.",
        robots: "noindex",
        alternates: {
          canonical: pageUrl,
        },
        openGraph: {
          title: "Blog Not Found - Trains Cafe",
          description: "No blog found for this URL.",
          url: pageUrl,
          type: "article",
          images: [`${baseUrl}/images/meta_image.png`],
        },
        twitter: {
          card: "summary_large_image",
          title: "Blog Not Found - Trains Cafe",
          description: "No blog found for this URL.",
          images: [`${baseUrl}/images/meta_image.png`],
        },
      };
    }

    const safeTitle = blog.metatitle || blog.title || "Trains Cafe Blog";
    const safeDesc =
      blog.metadescription || blog.description || "Train food, IRCTC tips.";
    const safeKeywords = blog.metakeyword || "train food, IRCTC food, blogs";
    const ogImage = blog.ogImage || "/images/meta_image.png";

    return {
      title: safeTitle,
      description: safeDesc,
      keywords: safeKeywords,
      robots: "index, follow",
      alternates: {
        canonical: pageUrl,
      },
      openGraph: {
        title: safeTitle,
        description: safeDesc,
        url: pageUrl,
        type: "article",
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
  } catch (err) {
    console.error(err);
    return {
      title: "Error - Trains Cafe",
      description: "Something went wrong.",
      robots: "noindex",
      alternates: {
        canonical: pageUrl,
      },
      openGraph: {
        title: "Error - Trains Cafe",
        description: "Something went wrong.",
        url: pageUrl,
        type: "article",
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
  return <SingleBlogClient params={params} />;
}
