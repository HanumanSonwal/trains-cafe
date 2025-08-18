import dbConnect from "../../lib/dbConnect";
import ContactRequestModel from "../../models/contactRequest";
export async function POST(req) {
  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get("slug") || url.pathname.split("/").pop();

    const validSlugs = ["Hotel", "Coolie", "BulkOrder", "ContactUs"];
    if (!validSlugs.includes(slug)) {
      console.error("Invalid slug:", slug);
      return new Response(
        JSON.stringify({ success: false, message: "Invalid slug" }),
        { status: 400 }
      );
    }

    const { Name, ContactNumber, Email, Message } = await req.json();

    if (!Name || !ContactNumber || !Email || !Message) {
      console.error("Missing required fields:", {
        Name,
        ContactNumber,
        Email,
        Message,
      });
      return new Response(
        JSON.stringify({ success: false, message: "All fields are required" }),
        { status: 400 }
      );
    }

    await dbConnect();

    const newContactRequest = new ContactRequestModel({
      slug,
      Name,
      ContactNumber,
      Email,
      Message,
    });

    await newContactRequest.save();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Contact request submitted successfully",
        data: newContactRequest,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error submitting contact request",
      }),
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const url = new URL(req.url);
    let slug = url.searchParams.get("slug")?.trim();

    const validSlugs = ["Hotel", "Coolie", "BulkOrder", "ContactUs"];

    if (slug && !validSlugs.includes(slug)) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid slug" }),
        { status: 400 }
      );
    }

    await dbConnect();

    const query = slug ? { slug } : {};

    const contactRequests = await ContactRequestModel.find(query).sort({
      createdAt: -1,
    });

    return new Response(
      JSON.stringify({
        success: true,
        data: contactRequests,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error fetching contact requests",
      }),
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get("slug") || url.pathname.split("/").pop();
    const requestId = url.searchParams.get("id");
    const validSlugs = ["Hotel", "Coolie", "BulkOrder", "ContactUs"];
    if (!validSlugs.includes(slug)) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid slug" }),
        { status: 400 }
      );
    }

    const { Name, ContactNumber, Email, Message } = await req.json();
    if (!Name || !ContactNumber || !Email || !Message) {
      return new Response(
        JSON.stringify({ success: false, message: "All fields are required" }),
        { status: 400 }
      );
    }

    await dbConnect();

    const updatedRequest = await ContactRequestModel.findByIdAndUpdate(
      requestId,
      { Name, ContactNumber, Email, Message },
      { new: true }
    );

    if (!updatedRequest) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Contact request not found",
        }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Contact request updated successfully",
        data: updatedRequest,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error updating contact request",
      }),
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get("slug") || url.pathname.split("/").pop();
    const requestId = url.searchParams.get("id");
    const validSlugs = ["Hotel", "Coolie", "BulkOrder", "ContactUs"];
    if (!validSlugs.includes(slug)) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid slug" }),
        { status: 400 }
      );
    }

    await dbConnect();

    const deletedRequest = await ContactRequestModel.findByIdAndDelete(
      requestId
    );

    if (!deletedRequest) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Contact request not found",
        }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Contact request deleted successfully",
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error deleting contact request",
      }),
      { status: 500 }
    );
  }
}
