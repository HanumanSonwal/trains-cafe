"use client";

// import { useRouter } from "next/router"; 
import { useEffect, useState } from "react";
import { Card } from "antd";
import dayjs from "dayjs";

const { Meta } = Card;

const BlogPost = ({ params }) => {
    const { slug } = params; 
//   const router = useRouter();
//   const { slug } = router.query.slug; 
  
  const [blogPost, setBlogPost] = useState(null);


  useEffect(() => {
    if (!slug) return; 

    const fetchBlogPost = async () => {
      try {
        const response = await fetch(`/api/blog?slug=${slug}`); 
        const data = await response.json();
        setBlogPost(data); 
      } catch (error) {
        console.error("Error fetching blog post:", error);
      }
    };

    fetchBlogPost(); 
  }, [slug]);

  if (!blogPost) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card
        cover={<img alt={blogPost.title} src={blogPost.image} />} 
        className="shadow-lg"
      >
        <Meta
          title={blogPost.title}
          description={`Published on ${dayjs(blogPost.updatedAt).format("DD MMM YYYY")}`} 
        />
        <div className="mt-4 text-gray-700">{blogPost.content}</div> 
      </Card>
    </div>
  );
};

export default BlogPost;
