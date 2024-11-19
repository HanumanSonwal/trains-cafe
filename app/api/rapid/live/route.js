// import { NextResponse } from 'next/server';

// export async function GET(req) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const trainNo = searchParams.get('trainNo');
//     const dateString = searchParams.get('date');

//     if (!dateString) {
//       return new Response(JSON.stringify({ error: "Date is missing from query parameters" }), { status: 400 });
//     }

//     const sentDate = new Date(dateString);
//     if (isNaN(sentDate.getTime())) {
//       return new Response(JSON.stringify({ error: "Invalid date format" }), { status: 400 });
//     }

//     // Get the current date
//     const currentDate = new Date();

//     // Set both dates to start of the day (ignore time)
//     const sentDateStartOfDay = new Date(sentDate.getFullYear(), sentDate.getMonth(), sentDate.getDate());
//     const currentDateStartOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

//     // Calculate the difference in days
//     const differenceInDays = Math.floor(
//       (currentDateStartOfDay - sentDateStartOfDay) / (1000 * 60 * 60 * 24)
//     );

//     // Construct query parameters
//     const queryParams = new URLSearchParams({
//         trainNo: trainNo,
//         startDay: differenceInDays
//       }).toString();

//     const thirdPartyResponse = await fetch(`${process.env.RAPID_URL}v1/liveTrainStatus?${queryParams}` , {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'x-rapidapi-host': process.env.RAPID_HOST,
//           'x-rapidapi-key': process.env.RAPID_API_KEY,
//         }
//     });
//     const data = await thirdPartyResponse.json();
//     return NextResponse.json({
//       data: data?.data? data.data: "",
//       success: data?.status ? data.status: "",
//       Timestamp: data?.Timestamp ? data.Timestamp: "",
//       message: data?.message ? data.message: ""
//     });
    
//   } catch (error) {
//     console.log(error,"error")
//     return NextResponse.json({
//       message: 'An error occurred',
//       error: error.message,
//     }, { status: 500 });
//   }
// }


// import { NextResponse } from 'next/server';

// export async function GET(req) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const trainNo = searchParams.get('trainNo');

//     if (!trainNo) {
//       return new Response(JSON.stringify({ error: "Train number is missing from query parameters" }), { status: 400 });
//     }

//     // Construct query parameters
//     const queryParams = new URLSearchParams({
//       trainNo: trainNo
//     }).toString();

//     // Fetch train schedule data from the IRCTC API
//     const thirdPartyResponse = await fetch(`https://irctc1.p.rapidapi.com/api/v1/getTrainSchedule?${queryParams}`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         'x-rapidapi-host': 'irctc1.p.rapidapi.com',
//         'x-rapidapi-key': process.env.RAPID_API_KEY, // Ensure to add your RapidAPI key in environment variables
//       },
//     });

//     const data = await thirdPartyResponse.json();

//     // Check if data is valid and return the response
//     if (!data || !data.data) {
//       return NextResponse.json({
//         message: 'Train schedule not found or invalid data returned',
//       }, { status: 404 });
//     }

//     return NextResponse.json({
//       data: data?.data ? data.data : "",
//       success: data?.status ? data.status : "",
//       Timestamp: data?.Timestamp ? data.Timestamp : "",
//       message: data?.message ? data.message : ""
//     });

//   } catch (error) {
//     console.error(error, "error");
//     return NextResponse.json({
//       message: 'An error occurred while fetching train schedule',
//       error: error.message,
//     }, { status: 500 });
//   }
// }


























import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    // Request से query parameters निकालें
    const { searchParams } = new URL(req.url);
    const trainNo = searchParams.get('trainNo');
    const dateString = searchParams.get('date');

    // Query parameters की वेलिडेशन करें
    if (!trainNo) {
      return NextResponse.json(
        { error: "Train number (trainNo) query parameter मिसिंग है।" },
        { status: 400 }
      );
    }

    if (!dateString) {
      return NextResponse.json(
        { error: "Date query parameter मिसिंग है।" },
        { status: 400 }
      );
    }

    // डेट को validate और process करें
    const sentDate = new Date(dateString);
    if (isNaN(sentDate.getTime())) {
      return NextResponse.json(
        { error: "Date का फॉर्मेट इनवेलिड है।" },
        { status: 400 }
      );
    }

    // वर्तमान दिनांक से अंतर निकालें
    const currentDate = new Date();
    const sentDateStartOfDay = new Date(
      sentDate.getFullYear(),
      sentDate.getMonth(),
      sentDate.getDate()
    );
    const currentDateStartOfDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );
    const differenceInDays = Math.floor(
      (currentDateStartOfDay - sentDateStartOfDay) / (1000 * 60 * 60 * 24)
    );

    // थर्ड-पार्टी API के लिए query parameters बनाएँ
    const queryParams = new URLSearchParams({
      trainNo,
      startDay: differenceInDays.toString(),
    }).toString();

    // थर्ड-पार्टी API कॉल करें
    const thirdPartyResponse = await fetch(
      `${process.env.RAPID_URL}v1/liveTrainStatus?${queryParams}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-host': process.env.RAPID_HOST,
          'x-rapidapi-key': process.env.RAPID_API_KEY,
        },
      }
    );

    // API कॉल में त्रुटि होने पर हैंडल करें
    if (!thirdPartyResponse.ok) {
      return NextResponse.json(
        {
          error: `थर्ड-पार्टी API से त्रुटि: ${thirdPartyResponse.statusText}`,
          status: thirdPartyResponse.status,
        },
        { status: thirdPartyResponse.status }
      );
    }

    // JSON रिस्पांस को प्रोसेस करें
    const data = await thirdPartyResponse.json();

    // JSON को Next.js के द्वारा रिटर्न करें
    return NextResponse.json({
      data: data?.data || "",
      success: data?.status || false,
      timestamp: data?.Timestamp || "",
      message: data?.message || "",
    });
  } catch (error) {
    // किसी भी अप्रत्याशित त्रुटि को हैंडल करें
    console.error("Error in API:", error);

    return NextResponse.json(
      {
        message: "आपकी रिक्वेस्ट को प्रोसेस करते समय त्रुटि हुई।",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
