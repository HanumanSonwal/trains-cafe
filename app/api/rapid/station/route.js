// app/api/example/route.js

import { NextResponse } from 'next/server';

// POST request handler
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query');
    const queryParams = new URLSearchParams({
        query: query
      }).toString();

    const thirdPartyResponse = await fetch(`${process.env.RAPID_URL}/v1/searchStation?${queryParams}` , {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-host': process.env.RAPID_HOST,
          'x-rapidapi-key': process.env.RAPID_API_KEY,
        }
        // body: JSON.stringify({
        //   name: name,
        //   email: email,
        // }),
    });
  
    const thirdPartyData = await thirdPartyResponse.json();
    return NextResponse.json({
      message: 'Data received successfully',
      data: { thirdPartyData },
    });
  } catch (error) {
    return NextResponse.json({
      message: 'An error occurred',
      error: error.message,
    }, { status: 500 });
  }
}
