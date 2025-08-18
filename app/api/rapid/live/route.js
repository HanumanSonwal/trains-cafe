import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const trainNo = searchParams.get("trainNo");
    const dateString = searchParams.get("date");

    if (!trainNo) {
      return NextResponse.json(
        { error: "Missing train number in query parameters" },
        { status: 400 }
      );
    }

    if (!dateString) {
      return NextResponse.json(
        { error: "Missing date in query parameters" },
        { status: 400 }
      );
    }

    const sentDate = new Date(dateString);
    if (isNaN(sentDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

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

    const queryParams = new URLSearchParams({
      trainNo,
      startDay: differenceInDays.toString(),
    }).toString();

    const apiUrl = `${process.env.RAPID_URL}v1/liveTrainStatus?${queryParams}`;

    const thirdPartyResponse = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Host": process.env.RAPID_HOST,
        "X-RapidAPI-Key": process.env.RAPID_API_KEY,
      },
    });

    const data = await thirdPartyResponse.json();

    return NextResponse.json({
      data: data?.data || null,
      success: data?.data?.success ?? data?.status ?? false,
      Timestamp: data?.Timestamp || "",
      message: data?.message || "",
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        message: "An error occurred",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
