const { NextResponse } = require("next/server");
import dbConnect from "@/app/lib/dbConnect";
import WebStation from "@/app/models/webStation";

 export async function DELETE(req, context) {
     try {
        await dbConnect();
        const { id } = context.params;

        await WebStation.deleteOne({ _id: id });

        return NextResponse.json({
            message: 'Web station deleted successfully',
        });
    } catch (error) {
        return NextResponse.json({
            message: 'An error occurred',
            error: error.message,
        }, { status: 500 });
        
    }
}

