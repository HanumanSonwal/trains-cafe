import Link from "next/link";
import Image from "next/image";

export default function Custom404() {
  const BASE_URL = process.env.NEXT_PUBLIC_URL || "http://localhost:3000/";
  return (
   
    <div className="flex md:py-8 py-6 flex-col md:flex-row items-center justify-center bg-[#fdf6ed] px-6 md:px-12">
  
      <div className="col-1 text-center max-w-[450px]">
        <h2  className="text-2xl md:text-5xl font-bold text-[#704d25] md:mb-4 mb-2">
          <span className="text-2xl text-center">404 - </span><br></br> Page Not Found
        </h2>
        <p className="text-sm text-justify text-gray-700 mb-6 max-w-md mx-auto md:mx-0">
          Oops! The page you are looking for does not exist or has been moved.
        </p>
        <Link
           href={`${BASE_URL}`}
          className="inline-block bg-[#704d25] text-white px-6 py-2 rounded-md text-md text-center  hover:bg-[#563b1c] transition-colors"
        >
          Go to Homepage
        </Link>
      </div>

    
      <div className="col-2 mt-8 md:mt-0 flex justify-center">
        <Image
          src="/images/404.png" 
          alt="Page Not Found Illustration"
          width={600}
          height={600}
                    className="object-contain max-w-[300px] md:max-w-auto  h-auto"

        />
      </div>
    </div>
  );
}
