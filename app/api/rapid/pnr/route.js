// // app/api/example/route.js

// import { NextResponse } from 'next/server';

// // POST request handler
// export async function GET(req) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const query = searchParams.get('query');
//     // Construct query parameters
//     const queryParams = new URLSearchParams({
//         pnrNumber: query
//       }).toString();

//     const thirdPartyResponse = await fetch(`${process.env.RAPID_URL}v3/getPNRStatus?${queryParams}` , {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'x-rapidapi-host': process.env.RAPID_HOST,
//           'x-rapidapi-key': process.env.RAPID_API_KEY,
//         }
//     });
//     const thirdPartyData = await thirdPartyResponse.json();

//     //console.log(thirdPartyData, "third");
    

//     const timestamp = thirdPartyData.timestamp; // Example timestamp (in milliseconds)
//     const date = new Date(timestamp); // Convert timestamp to Date object


//     const params = new URLSearchParams({
//       trainNo: thirdPartyData.data.TrainNo,
//       date: date.toISOString()
//     }).toString();

//     const liveTrainStatus = await fetch(`${process.env.NEXTAUTH_URL}/api/rapid/live?${params}` , {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     });

//     const data = await liveTrainStatus.json();
  
//     return NextResponse.json({
//       data: data?.data ? data.data: "",
//       success: true,
//       message: data?.message ? data.message: ""
//     });
//   } catch (error) {
//     return NextResponse.json({
//       message: 'An error occurred',
//       error: error.message,
//     }, { status: 500 });
//   }
// }


// app/api/example/route.js

import { NextResponse } from 'next/server';

// GET request handler
export async function GET(req) {
  try {
    const { searchParams } = req.nextUrl;
    const query = searchParams.get('query');

    // Construct query parameters
    const queryParams = new URLSearchParams({
      pnrNumber: query
    }).toString();

    const thirdPartyResponse = await fetch(`${process.env.RAPID_URL}/v3/getPNRStatus?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-host': process.env.RAPID_HOST,
        'x-rapidapi-key': process.env.RAPID_API_KEY,
      }
    });

    const thirdPartyData = await thirdPartyResponse.json();

    // Convert timestamp to Date object
    const timestamp = thirdPartyData.timestamp;
    const date = new Date(timestamp).toISOString(); // ISO format for compatibility

    // Pass data to live train status API
    const params = new URLSearchParams({
      trainNo: thirdPartyData.data.TrainNo,
      date: date
    }).toString();

    const liveTrainStatus = await fetch(`${process.env.NEXTAUTH_URL}/api/rapid/live?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await liveTrainStatus.json();

    return NextResponse.json({
      data: data?.data || "",
      success: true,
      message: data?.message || ""
    });
  } catch (error) {
    return NextResponse.json({
      message: 'An error occurred',
      error: error.message,
    }, { status: 500 });
  }
}
