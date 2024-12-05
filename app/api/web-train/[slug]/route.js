import { NextResponse } from "next/server";
import WebTrain from "@/app/models/webtrain";
import dbConnect from "@/app/lib/dbConnect";

export async function GET(req, context) {
    try {
        const { slug } = context.params;

        if(!slug) {
            return NextResponse.json({
                message: 'Web station page not found',
            }, { status: 404 });
        }

        await dbConnect();

        const result = await WebTrain.findOne({ slug, status: 'published' });

        if (!result) {
            return NextResponse.json({
                message: 'Web station not found',
            }, { status: 404 });
        }

        return NextResponse.json(result)

        
    } catch (error) {
        return NextResponse.json({
            message: 'An error occurred',
            error: error.message,
        }, { status: 500 });
    }
}