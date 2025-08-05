import { Inter } from "next/font/google";
import "../globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import ProviderWrapper from "../componants/ProviderWrapper";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://trainscafe.in";

export const metadata = {
  title: {
    default: "Trains Cafe",
    template: "%s | Trains Cafe",
  },
  description: "Order fresh, hygienic food in trains across India.",
  robots: "index, follow",
  themeColor: "#d28927",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#D28927" />

        {/* ✅ Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="shortcut icon" href="/favicon.ico" />

        {/* ✅ Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/apple-touch-icon-57x57.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/apple-touch-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-114x114.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-144x144.png" />

        {/* ✅ PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* ✅ PWA Icons */}
        <link rel="icon" sizes="192x192" href="/icons/icon-192x192.png" />
        <link rel="icon" sizes="512x512" href="/icons/icon-512x512.png" />

        {/* ✅ Robots meta */}
        <meta name="robots" content="index, follow" />

        {/* ✅ Open Graph fallback image */}
        <meta property="og:site_name" content="Trains Cafe" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/images/meta_image.png" />
        <meta name="twitter:image" content="/images/meta_image.png" />

        {/* ✅ Twitter Card fallback */}
        <meta name="twitter:card" content="summary_large_image" />

        {/* ✅ LocalBusiness Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: `{
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Trainscafe - Best Food Delivery in Train",
              "image": "${siteUrl}/og-meta.png",
              "url": "${siteUrl}/",
              "telephone": "+91 8696963496",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "8, Paschim vihar, D, Bhakrota",
                "addressLocality": "Jaipur",
                "addressRegion": "Rajasthan",
                "postalCode": "302026",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 26.8798334524791,
                "longitude": 75.69475091525041
              },
              "sameAs": [
                "https://www.facebook.com/people/Trainscafe/100091421607880/",
                "https://www.instagram.com/trainscafe_/",
                "https://www.threads.com/@trainscafe_",
                "https://x.com/trainscafe",
                "https://in.pinterest.com/trainscafe/",
                "https://www.linkedin.com/company/trainscafe",
                "https://www.youtube.com/@trainscafe",
                "https://www.reddit.com/user/cafetrains/",
                "https://www.tumblr.com/trainscafe",
                "https://g.co/kgs/w5LPCJP"
              ],
              "description": "Trainscafe is India’s trusted train food delivery service offering fresh, hygienic meals in trains across 450+ stations."
            }`,
          }}
        />

        {/* ✅ SearchAction Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: `{
              "@context": "https://schema.org",
              "@type": "WebSite",
              "url": "${siteUrl}/",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "${siteUrl}/search?query={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            }`,
          }}
        />
      </head>
      <body
        className={inter.className}
        style={{
          maxWidth: "575px",
          margin: "0 auto",
        }}
      >
        <AntdRegistry>
          <ProviderWrapper>{children}</ProviderWrapper>
        </AntdRegistry>

           <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
