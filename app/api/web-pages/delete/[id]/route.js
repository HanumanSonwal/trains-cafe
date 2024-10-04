const { NextResponse } = require("next/server");
import dbConnect from "@/app/lib/dbConnect";
import WebPage from "@/app/models/webPage";

 export async function DELETE(req, context) {
     try {



        await dbConnect();
        const { id } = context.params;

        await WebPage.deleteOne({ _id: id });

        return NextResponse.json({
            message: 'Web page deleted successfully',
        });
    } catch (error) {
        return NextResponse.json({
            message: 'An error occurred',
            error: error.message,
        }, { status: 500 });
        
    }
}

