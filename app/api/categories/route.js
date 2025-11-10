import dbConnect from "../../lib/dbConnect";
import CategoryModel from "../../models/category";
import { requireRole } from "../../utils/auth";

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
            { title: { $regex: search, $options: "i" } },
            { image: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const skip = (page - 1) * limit;

    const categories = await CategoryModel.find(searchCriteria)
      .skip(skip)
      .limit(limit);

    const total = await CategoryModel.countDocuments(searchCriteria);

    return new Response(
      JSON.stringify({
        success: true,
        data: categories,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: "Error fetching categories" }),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const body = Object.fromEntries(formData.entries());

    if (!body.title || !body.image) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Title and image are required",
        }),
        { status: 400 }
      );
    }

    await dbConnect();
    const newCategory = new CategoryModel(body);
    await newCategory.save();

    return new Response(JSON.stringify(newCategory), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}

export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const formData = await req.formData();
    const updateData = Object.fromEntries(formData.entries());

    if (!id) {
      return new Response(
        JSON.stringify({ success: false, message: "Category ID is required" }),
        { status: 400 }
      );
    }

    await dbConnect();
    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedCategory) {
      return new Response(
        JSON.stringify({ success: false, message: "Category not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Category updated successfully",
        data: updatedCategory,
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
        JSON.stringify({ success: false, message: "Category ID is required" }),
        { status: 400 }
      );
    }

    await dbConnect();
    const deletedCategory = await CategoryModel.findByIdAndDelete(id);

    if (!deletedCategory) {
      return new Response(
        JSON.stringify({ success: false, message: "Category not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Category deleted successfully",
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
