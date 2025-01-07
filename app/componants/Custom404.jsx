import Link from "next/link";

export default function Custom404() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center">
      <h1 className="text-4xl font-bold text-coffee-600 mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-gray-700 mb-6">
        Oops! The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="bg-coffee-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-coffee-700"
      >
        Go to Homepage
      </Link>
      <style jsx>{`
        .text-coffee-600 {
          color: #704d25;
        }
        .bg-coffee-600 {
          background-color: #704d25;
        }
        .bg-coffee-700 {
          background-color: #563b1c;
        }
      `}</style>
    </div>
  );
}
