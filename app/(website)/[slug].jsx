import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const Page = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [pageData, setPageData] = useState({ title: '', text: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      // Function to fetch data from the API
      const fetchPageData = async () => {
        try {
          const response = await fetch(`/api/pages/${slug}`);
          if (response.ok) {
            const data = await response.json();
            setPageData(data);
          } else {
            setPageData({ title: 'Page Not Found', text: 'The requested page does not exist.' });
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          setPageData({ title: 'Error', text: 'There was a problem fetching the data.' });
        } finally {
          setLoading(false);
        }
      };

      fetchPageData();
    }
  }, [slug]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{pageData.title}</h1>
      <p>{pageData.text}</p>
    </div>
  );
};

export default Page;
