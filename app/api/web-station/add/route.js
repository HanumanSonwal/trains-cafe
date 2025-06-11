// import dbConnect from '@/app/lib/dbConnect';
// import WebStation from "@/app/models/webStation";
// import { NextResponse } from 'next/server';
// import slugify from 'slugify';
// import StationModel from '@/app/models/station';

// export async function POST(req) { 
//     try {
//             await dbConnect();

//         const { name, title, description, keywords, pageData ,Station } = await req.json();

//         const slug = slugify(title, { lower: true, strict: true });
        
//         const webStation = new WebStation({
//             name,
//             slug,
//             title,
//             Station,
//             description,
//             keywords,
//             pageData,
//         });

//      const result =  await webStation.save();

//         return NextResponse.json({
//             message: 'Web station added successfully',
//             data: { result },
//         });

//     } catch (error) {
//         return NextResponse.json({
//             message: 'An error occurred',
//             error: error.message,
//         }, { status: 500 });
//     }
// }

import dbConnect from '@/app/lib/dbConnect';
import WebStation from "@/app/models/webStation";
import { NextResponse } from 'next/server';
import slugify from 'slugify';
import StationModel from '@/app/models/station';

export async function POST(req) {
  try {
    await dbConnect();

    const { name, title, description, keywords, pageData, Station } = await req.json();

    const stationData = await StationModel.findById(Station); 
    if (!stationData) {
      return NextResponse.json({ message: 'Invalid station ID' }, { status: 400 });
    }

    const stationSlug = slugify(`${stationData.name}-${stationData.code}`, {
      lower: true,
      strict: true,
    });

    const slug = `order-food-on-train-at-${stationSlug}`;

    const webStation = new WebStation({
      name,
      slug,
      title,
      Station,
      description,
      keywords,
      pageData,
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
