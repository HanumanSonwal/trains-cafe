const { NextResponse } = require("next/server");
import dbConnect from "@/app/lib/dbConnect";
import WebPage from "@/app/models/webPage";


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

     const result = await WebPage.paginate({}, options);

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

