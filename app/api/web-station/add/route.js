import dbConnect from '@/app/lib/dbConnect';
import WebStation from "@/app/models/webStation";
import { NextResponse } from 'next/server';
import StationModel from '@/app/models/station';
import { createStationSlug } from "@/utils/slugify";

export async function POST(req) {
  try {
    await dbConnect();

    const { name, title, description, keywords, pageData, Station } = await req.json();

    const stationData = await StationModel.findById(Station);
    if (!stationData) {
      return NextResponse.json({ message: 'Invalid station ID' }, { status: 400 });
    }

    const slug = createStationSlug(stationData.name, stationData.code);

    const webStation = new WebStation({
      name,
      slug, 
      title,
      Station,
      description,
      keywords,
      pageData,
      status: 'published', 
    });

    const result = await webStation.save();

    return NextResponse.json({
      message: 'Web station added successfully',
      data: { result },
    });
  } catch (error) {
    return NextResponse.json({
      message: 'An error occurred',
      error: error.message,
    }, { status: 500 });
  }
}
