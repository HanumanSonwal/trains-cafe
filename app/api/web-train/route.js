const { NextResponse } = require("next/server");
import dbConnect from "@/app/lib/dbConnect";
import WebTrain from "@/app/models/webtrain";


export async function GET(req) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const page = searchParams.get("page") || 1;
        const limit = searchParams.get("limit") || 10;        
        

    const options = {
       page: parseInt(page, 10),
       limit: parseInt(limit, 10),
       sort: { createdAt: -1 }, 
     };

     const result = await WebTrain.paginate({}, options);

   return NextResponse.json(
        result
   );
    } catch (error) {
        return NextResponse.json({
            message: 'An error occurred',
            error: error.message,
        }, { status: 500 });
        
    }


}

