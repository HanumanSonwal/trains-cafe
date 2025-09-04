import { Inter } from "next/font/google";
import "../globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import ProviderWrapper from "../componants/ProviderWrapper";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

const siteUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000/";

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

        {/* Favicon and Icons */}
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon-57x57.png" />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="/apple-touch-icon-72x72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="/apple-touch-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/apple-touch-icon-144x144.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" sizes="192x192" href="/icons/icon-192x192.png" />
        <link rel="icon" sizes="512x512" href="/icons/icon-512x512.png" />

        {/* Robots */}
        <meta name="robots" content="index, follow" />

        {/* ✅ Open Graph Meta Tags */}
        <meta property="og:site_name" content="Trains Cafe" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Trainscafe – Fresh & Hygienic Food Delivery in Train"
        />
        <meta
          property="og:description"
          content="Order food online in train with Trainscafe. Get fresh, hygienic meals delivered right at your seat."
        />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:image" content="/images/meta_image.png" />

        {/* ✅ Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Trainscafe – Food Delivery in Train"
        />
        <meta
          name="twitter:description"
          content="Order fresh food in train online. Hygienic meals delivered at your train seat."
        />
        <meta name="twitter:image" content="/images/meta_image.png" />

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

        {/* ✅ WebSite Schema */}
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

        {/* ✅ Aggregate Rating Schema (Static for all pages) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: `{
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Trains Cafe",
              "url": "${siteUrl}/",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "325000"
              }
            }`,
          }}
        />

        {/* ✅ Organization Schema (extra details: logo + contactPoint) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: `{
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Trainscafe",
              "url": "${siteUrl}/",
              "logo": "${siteUrl}/images/logo.jpg",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-8696963496",
                "contactType": "customer service",
                "areaServed": "IN",
                "availableLanguage": ["English","Hindi"]
              }
            }`,
          }}
        />

        {/* ✅ FAQPage Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: `{
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "How can I order food in train from Trainscafe?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Visit Trainscafe.in, enter your PNR number, browse the menu from FSSAI-approved restaurants, and place your order online. Fresh food will be delivered directly to your train seat."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can I order food in train without PNR?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "PNR is recommended for accurate delivery, but you can also order using train name and seat details. For assistance, call +91 8696963496."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is Trainscafe food delivery available at my station?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, Trainscafe delivers food at 450+ major railway stations across India, including Delhi, Jaipur, Mumbai, Lucknow, and more."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What type of food can I order in train?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "You can order vegetarian thalis, non-veg meals, South Indian, North Indian, Jain food, Chinese, snacks, and beverages from top restaurants near your station."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is Jain food available in train?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, Trainscafe offers fresh and hygienic Jain food without onion and garlic, available at most major stations."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can I order food in train at night?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, Trainscafe accepts orders from 7 AM to 10 PM. For late-night delivery, please confirm by calling our support team at +91 8696963496."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Do you provide cash on delivery for train food orders?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, you can pay online via UPI, debit/credit card, wallets, or opt for cash on delivery at your train seat."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is the food hygienic and FSSAI approved?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Absolutely! Trainscafe partners only with FSSAI-approved restaurants to ensure hygienic and tasty meals during your journey."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How can I contact Trainscafe?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "You can call our customer care at +91 8696963496 for any queries, support, or assistance with your food order in train."
                  }
                }
              ]
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
