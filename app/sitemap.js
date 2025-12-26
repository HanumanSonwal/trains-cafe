export default function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: new Date(),
      priority: 0.3,
    },
    {
      url: `${baseUrl}/checkout`,
      lastModified: new Date(),
      priority: 0.3,
    },
    {
      url: `${baseUrl}/contact-us`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/group-food-ordering-in-train`,
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      url: `${baseUrl}/menu`,
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      url: `${baseUrl}/online-coolie-booking`,
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      url: `${baseUrl}/online-hotel-booking`,
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      url: `${baseUrl}/order-confirmation`,
      lastModified: new Date(),
      priority: 0.2,
    },
    {
      url: `${baseUrl}/vendor-registration`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/stations`,
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: `${baseUrl}/trains`,
      lastModified: new Date(),
      priority: 0.9,
    },
  ];
}
