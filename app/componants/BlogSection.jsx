// "use client";

// import React, { useEffect, useState } from "react";
// import { Card, Button, message } from "antd";
// import { ArrowRightOutlined } from "@ant-design/icons";
// import Link from "next/link";
// import dayjs from "dayjs";

// const { Meta } = Card;

// const BlogSection = () => {
//   const [blogPosts, setBlogPosts] = useState([]);
//   const [loading, setLoading] = useState(true); 

//   useEffect(() => {

//     const fetchBlogPosts = async () => {
//       try {
//         const response = await fetch(`/api/blog?search=&page=${1}&limit=${10}`);
//         if (response.ok) {
//           const data = await response.json();
//           console.log(data.docs, "ffadata");
        
//           setBlogPosts(data.docs.slice(0, 2));
//         } else {
//           message.error("Failed to fetch blog posts");
//         }
//       } catch (error) {
//         message.error("Something went wrong while fetching blog posts");
//       } finally {
//         setLoading(false); 
//       }
//     };

//     fetchBlogPosts();
//   }, []); 

//   return (
//     <div className="py-8 mx-auto max-w-[575px]">
//       <div className="relative text-center mb-8">
//         <img
//           src="/images/Blog.png"
//           alt="Blog Title Background"
//           className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2"
//         />
//         <h2 className="text-2xl font-bold relative z-10 text-[#704D25]">
//           Our Blogs
//         </h2>
//       </div>
//       {loading ? (
//         <div className="text-center">Loading blogs...</div>
//       ) : (
//         <div className="flex flex-wrap justify-center">
//           {blogPosts.map((post) => {
//             const formattedDate = dayjs(post.updatedAt).format("MMMM DD, YYYY");

//             return (
//               <div
//                 key={post.id}
//                 className="w-full max-w-[275px] sm:max-w-[calc(50%-16px)] mx-2 mb-8 shadow-lg rounded-lg"
//               >
//                 <Card hoverable cover={<img alt={post.title} src={post.image} />}>
//                   <div className="flex justify-between items-center mb-2">
//                     <p className="text-sm blog-date text-gray-400">{formattedDate}</p>
//                     <div className="flex items-center text-sm text-gray-400">
//                       <img
//                         src="/images/user-icon.png"
//                         alt="Author"
//                         className="w-4 h-4 mr-2"
//                       />
//                       <p className="blog-author">By Admin</p>
//                     </div>
//                   </div>
//                   <Meta
//                     className="text-[#3A3A3A]"
//                     title={post.title}
//                     description={post.description}
//                   />
//                   <Link href={`/blog/${post.slug}`} passHref>
//                     <Button type="link" className="blog-link mt-4 flex items-center">
//                       Read more <ArrowRightOutlined className="ml-1" />
//                     </Button>
//                   </Link>
//                 </Card>
//               </div>
//             );
//           })}
//         </div>
//       )}


//         <div className="text-center ">
//         <Link href={`/blog`} passHref>
//         <Button type="link" className="blog-link mt-4 flex items-center">
//         View More Blogs<ArrowRightOutlined className="ml-1" />
//                     </Button>
//           </Link>
//         </div>
  
//     </div>
//   );
// };

// export default BlogSection;

"use client";

import React, { useEffect, useState } from "react";
import { Card, Button, message } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import Link from "next/link";
import dayjs from "dayjs";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const { Meta } = Card;

const BlogSection = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch(`/api/blog?search=&page=1&limit=10`);
        if (response.ok) {
          const data = await response.json();
          setBlogPosts(data.docs.slice(0, 6)); // Adjust number of items to show
        } else {
          message.error("Failed to fetch blog posts");
        }
      } catch (error) {
        message.error("Something went wrong while fetching blog posts");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  return (
    <div className="py-8 mx-auto max-w-[1200px] px-4">
      <div className="relative text-center mb-8">
        <img
          src="/images/Blog.png"
          alt="Blog Title Background"
          className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        />
        <h2 className="text-2xl font-bold relative z-10 text-[#704D25]">
          Our Blogs
        </h2>
      </div>

      {loading ? (
        <div className="text-center">Loading blogs...</div>
      ) : (
        <Swiper
          spaceBetween={20}
          slidesPerView={2}
          autoplay={{ delay: 3000 }}
          // pagination={{ clickable: true }}
          modules={[Autoplay, Pagination]}
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            575: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 2,
            },
          }}
        >
          {blogPosts.map((post) => {
            const formattedDate = dayjs(post.updatedAt).format("MMMM DD, YYYY");

            return (
              <SwiperSlide key={post.id}>
                <div className="p-3">
                  <Card className="blog-body" hoverable  cover={<img alt={post.title} src={post.image} />}>
                    <div className="flex justify-between items-center mb-2 gap-2">
                      <div><p className="text-sm text-gray-400">{formattedDate}</p></div>
                      <div className="flex items-center text-sm text-gray-400">
                        <img
                          src="/images/user-icon.png"
                          alt="Author"
                          className="w-4 h-4 mr-2"
                        />
                        <p>By Admin</p>
                      </div>
                    </div>
                   <Meta
  className="text-[#3A3A3A]"
  title={post.title}
  description={post.description
    ?.split(" ")
    .slice(0, 8)
    .join(" ") + (post.description?.split(" ").length > 8 ? "..." : "")}
/>

                    <Link href={`/blog/${post.slug}`} passHref>
                      <Button type="link" className="mt-4 flex items-center">
                        Read more <ArrowRightOutlined className="ml-1" />
                      </Button>
                    </Link>
                  </Card>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}

      <div className="text-center mt-6">
        <Link href={`/blog`} passHref>
          <Button type="link" className="flex items-center">
            View More Blogs <ArrowRightOutlined className="ml-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default BlogSection;
