import { NextResponse } from "next/server";


export async function POST(req, context) {
    try {
        const { id } = req.context;

        if(!id) {
         NextResponse.json({ message: "Order id is required" }, 400);   
        }

    } catch (error) {
        
    }
}