const { NextResponse } = require("next/server");
import dbConnect from "@/app/lib/dbConnect";
import WebTrain from "@/app/models/webtrain";

 export async function DELETE(req, context) {
     try {
        await dbConnect();
        const { id } = context.params;

        await WebTrain.deleteOne({ _id: id });

        return NextResponse.json({
            message: 'Web train deleted successfully',
        });
    } catch (error) {
        return NextResponse.json({
            message: 'An error occurred',
            error: error.message,
        }, { status: 500 });
        
    }
}

