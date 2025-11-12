import dbConnect from "@/app/lib/dbConnect";
import CustomerModel from "@/app/models/customer";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";
    const page = parseInt(url.searchParams.get("page"), 10) || 1;
    const limit = parseInt(url.searchParams.get("limit"), 10) || 10;

    await dbConnect();

    const searchCriteria = search
      ? {
          $or: [
            { Customer_Name: { $regex: search, $options: "i" } },
            { PNR: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const skip = (page - 1) * limit;

    const customers = await CustomerModel.find(searchCriteria)
      .skip(skip)
      .limit(limit);

    const total = await CustomerModel.countDocuments(searchCriteria);

    return new Response(
      JSON.stringify({
        success: true,
        data: customers,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: "Error fetching customers" }),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    if (
      !body.Customer_Name ||
      !body.Mobile_Number ||
      !body.Email ||
      !body.PNR ||
      !body.Coach ||
      !body.Discount ||
      !body.Seat_No
    ) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "All required fields must be filled",
        }),
        { status: 400 }
      );
    }
    await dbConnect();
    const newcustomer = new CustomerModel(body);
    await newcustomer.save();
    return new Response(
      JSON.stringify({
        success: true,
        message: "Customer added successfully",
        data: newcustomer,
      }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const updateData = await req.json();

    if (!id) {
      return new Response(
        JSON.stringify({ success: false, message: "Customer ID is required" }),
        { status: 400 }
      );
    }

    await dbConnect();
    const updatedcustomer = await CustomerModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedcustomer) {
      return new Response(
        JSON.stringify({ success: false, message: "Customer not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Customer updated successfully",
        data: updatedcustomer,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return new Response(
        JSON.stringify({ success: false, message: "Customer ID is required" }),
        { status: 400 }
      );
    }

    await dbConnect();
    const deletedCustomer = await CustomerModel.findByIdAndDelete(id);
    if (!deletedCustomer) {
      return new Response(
        JSON.stringify({ success: false, message: "Customer not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Customer deleted successfully",
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}
