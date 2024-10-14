// app/api/example/route.js
import { NextResponse } from 'next/server';

// POST request handler
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query');
    // Construct query parameters
    const queryParams = new URLSearchParams({
        query: query
      }).toString();

    const thirdPartyResponse = await fetch(`${process.env.RAPID_URL}v1/searchTrain?${queryParams}` , {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-host': process.env.RAPID_HOST,
          'x-rapidapi-key': process.env.RAPID_API_KEY,
        }
    });
    const data = await thirdPartyResponse.json();
    return NextResponse.json({
      data: data?.data? data.data: "",
      success: data?.status ? data.status: "",
      Timestamp: data?.Timestamp ? data.Timestamp: "",
      message: data?.message ? data.message: ""

    });
  } catch (error) {
    return NextResponse.json({
      message: 'An error occurred',
      error: error.message,
    }, { status: 500 });
  }
}
