import dbConnect from "../../lib/dbConnect";
import AdvertisementsModel from "../../models/add";

const isValidSlug = (slug) => ["advertisements", "Banner"].includes(slug);

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get("slug");
    const search = url.searchParams.get("search") || "";

    if (slug && !isValidSlug(slug)) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid slug" }),
        { status: 400 }
      );
    }

    await dbConnect();

    const searchCriteria = search
      ? {
          slug: slug || { $in: ["advertisements", "Banner"] },
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        }
      : { slug: slug || { $in: ["advertisements", "Banner"] } };

    const advertisements = await AdvertisementsModel.find(searchCriteria);

    return new Response(
      JSON.stringify({
        success: true,
        data: advertisements,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching advertisements:", error.message);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error fetching advertisements",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    if (!isValidSlug(body.slug)) {
      return new Response(
        JSON.stringify({
          success: false,
          message:
            'Invalid slug. Allowed values are "advertisements" or "Banner".',
        }),
        { status: 400 }
      );
    }

    if (!body.slug || !body.title || !body.image || !body.description) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Slug, title, image, and description are required",
        }),
        { status: 400 }
      );
    }

    await dbConnect();

    const newAdvertisement = new AdvertisementsModel(body);
    await newAdvertisement.save();

    return new Response(
      JSON.stringify({ success: true, data: newAdvertisement }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating advertisement:", error.message);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error creating advertisement",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const id = searchParams.get("id");
    const body = await req.json();

    if (!isValidSlug(slug)) {
      return new Response(
        JSON.stringify({
          success: false,
          message:
            'Invalid slug. Allowed values are "advertisements" or "Banner".',
        }),
        { status: 400 }
      );
    }

    if (!slug || !id) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Slug and advertisement ID are required",
        }),
        { status: 400 }
      );
    }

    await dbConnect();

    const updatedAdvertisement = await AdvertisementsModel.findOneAndUpdate(
      { _id: id, slug },
      body,
      { new: true, runValidators: true }
    );

    if (!updatedAdvertisement) {
      return new Response(
        JSON.stringify({ success: false, message: "Advertisement not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: updatedAdvertisement }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating advertisement:", error.message);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error updating advertisement",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { slug, id } = await req.json();

    if (!isValidSlug(slug)) {
      return new Response(
        JSON.stringify({
          success: false,
          message:
            'Invalid slug. Allowed values are "advertisements" or "Banner".',
        }),
        { status: 400 }
      );
    }

    if (!slug || !id) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Slug and advertisement ID are required",
        }),
        { status: 400 }
      );
    }

    await dbConnect();

    const deletedAdvertisement = await AdvertisementsModel.findOneAndDelete({
      _id: id,
      slug,
    });

    if (!deletedAdvertisement) {
      return new Response(
        JSON.stringify({ success: false, message: "Advertisement not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Advertisement deleted successfully",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting advertisement:", error.message);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error deleting advertisement",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
