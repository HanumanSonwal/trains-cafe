"use client";
import { useEffect, useState } from 'react';

const TrainDetails = ({ params }) => {
  const { trainNumber } = params; 
  const [trainData, setTrainData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrainDetails = async () => {
      try {
        const response = await fetch(`/api/rapid/train?query=${trainNumber}`);
        const result = await response.json();

        if (response.ok) {
          setTrainData(result.data.thirdPartyData.data[0]);
        } else {
          throw new Error(result.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainDetails();
  }, [trainNumber]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }


  return (
    <div>
      <h1>Train Details for Train Number: {trainNumber}</h1>
      {trainData ? (
        <div>
          <p><strong>Train Number:</strong> {trainData.train_number}</p>
          <p><strong>Train Name:</strong> {trainData.train_name}</p>
          <p><strong>English Train Name:</strong> {trainData.eng_train_name}</p>
          <p><strong>Status:</strong> {trainData.status ? "Running" : "Not Running"}</p>
          <p><strong>Message:</strong> {trainData.message}</p>
          <p><strong>Timestamp:</strong> {new Date(trainData.timestamp).toLocaleString()}</p>
        </div>
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
};

export default TrainDetails;
