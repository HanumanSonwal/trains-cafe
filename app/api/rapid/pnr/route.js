import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = req.nextUrl;
    const query = searchParams.get("query");

    const queryParams = new URLSearchParams({
      pnrNumber: query,
    }).toString();

    const thirdPartyResponse = await fetch(
      `${process.env.RAPID_URL}/v3/getPNRStatus?${queryParams}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-rapidapi-host": process.env.RAPID_HOST,
          "x-rapidapi-key": process.env.RAPID_API_KEY,
        },
      }
    );

    const thirdPartyData = await thirdPartyResponse.json();

    const timestamp = thirdPartyData.timestamp;
    const date = new Date(timestamp).toISOString();

    const params = new URLSearchParams({
      trainNo: thirdPartyData.data.TrainNo,
      date: date,
    }).toString();

    const liveTrainStatus = await fetch(
      `${process.env.NEXTAUTH_URL}/api/rapid/live?${params}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await liveTrainStatus.json();

    return NextResponse.json({
      data: data?.data || "",
      success: true,
      message: data?.message || "",
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
