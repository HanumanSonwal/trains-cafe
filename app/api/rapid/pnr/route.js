// app/api/example/route.js

import { NextResponse } from 'next/server';

// POST request handler
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query');
    // Construct query parameters
    const queryParams = new URLSearchParams({
        pnrNumber: query
      }).toString();

    const thirdPartyResponse = await fetch(`${process.env.RAPID_URL}v3/getPNRStatus?${queryParams}` , {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-host': process.env.RAPID_HOST,
          'x-rapidapi-key': process.env.RAPID_API_KEY,
        }
    });
    const thirdPartyData = await thirdPartyResponse.json();

    const timestamp = thirdPartyData.timestamp; // Example timestamp (in milliseconds)
    const date = new Date(timestamp); // Convert timestamp to Date object


    const params = new URLSearchParams({
      trainNo: thirdPartyData.data.TrainNo,
      date: date.toISOString()
    }).toString();

    const liveTrainStatus = await fetch(`${process.env.NEXTAUTH_URL}/api/rapid/live?${params}` , {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const liveData = await liveTrainStatus.json();
  
    return NextResponse.json({
      message: 'Data received successfully',
      data: { liveData },
    });
  } catch (error) {
    return NextResponse.json({
      message: 'An error occurred',
      error: error.message,
    }, { status: 500 });
  }
}
