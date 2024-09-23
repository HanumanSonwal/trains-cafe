"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const PnrDetails = () => {
  const router = useRouter();
  const { pnr } = router.query;

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/rapid/pnr?query=${pnr}`);
        const result = await response.json();
        setData(result.data.thirdPartyData); 
      } catch (error) {
        console.error("Error fetching PNR data:", error);
      }
    };

    if (pnr) {
      fetchData();
    }
  }, [pnr]);

  return (
    <div>
      <h1>PNR Details for {pnr}</h1>
      {data ? (
        <div>
         
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PnrDetails;
