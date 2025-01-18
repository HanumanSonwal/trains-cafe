import dbConnect from '../../lib/dbConnect';
import AdvertisementsModel from '../../models/add';

// GET: Fetch advertisements with filters based on slug
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get('slug'); // Get slug parameter

    if (!slug) {
      return new Response(
        JSON.stringify({ success: false, message: 'Slug is required' }),
        { status: 400 }
      );
    }

    await dbConnect();
    console.log("Database connected successfully");

    const advertisements = await AdvertisementsModel.find({ slug });
    console.log("Advertisements fetched successfully");

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
      JSON.stringify({ success: false, message: 'Error fetching advertisements', error: error.message }),
      { status: 500 }
    );
  }
}

// POST: Create a new advertisement based on slug
export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.slug || !body.title || !body.image || !body.description) {
      return new Response(
        JSON.stringify({ success: false, message: 'Slug, title, image, and description are required' }),
        { status: 400 }
      );
    }

    await dbConnect();
    console.log("Database connected for creating advertisement");

    const newAdvertisement = new AdvertisementsModel(body);
    await newAdvertisement.save();

    console.log("Advertisement created successfully");

    return new Response(
      JSON.stringify({ success: true, data: newAdvertisement }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating advertisement:", error.message);
    return new Response(
      JSON.stringify({ success: false, message: 'Error creating advertisement', error: error.message }),
      { status: 500 }
    );
  }
}

// PUT: Update an advertisement based on slug
export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug'); // Get slug parameter
    const id = searchParams.get('id');
    const body = await req.json();

    if (!slug || !id) {
      return new Response(
        JSON.stringify({ success: false, message: 'Slug and advertisement ID are required' }),
        { status: 400 }
      );
    }

    await dbConnect();
    console.log("Database connected for updating advertisement");

    const updatedAdvertisement = await AdvertisementsModel.findOneAndUpdate(
      { _id: id, slug }, // Match by ID and slug
      body,
      { new: true, runValidators: true }
    );

    if (!updatedAdvertisement) {
      return new Response(
        JSON.stringify({ success: false, message: 'Advertisement not found' }),
        { status: 404 }
      );
    }

    console.log("Advertisement updated successfully");

    return new Response(
      JSON.stringify({ success: true, data: updatedAdvertisement }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating advertisement:", error.message);
    return new Response(
      JSON.stringify({ success: false, message: 'Error updating advertisement', error: error.message }),
      { status: 500 }
    );
  }
}

// DELETE: Delete an advertisement based on slug
export async function DELETE(req) {
  try {
    const { slug, id } = await req.json();

    if (!slug || !id) {
      return new Response(
        JSON.stringify({ success: false, message: 'Slug and advertisement ID are required' }),
        { status: 400 }
      );
    }

    await dbConnect();
    console.log("Database connected for deleting advertisement");

    const deletedAdvertisement = await AdvertisementsModel.findOneAndDelete({ _id: id, slug });

    if (!deletedAdvertisement) {
      return new Response(
        JSON.stringify({ success: false, message: 'Advertisement not found' }),
        { status: 404 }
      );
    }

    console.log("Advertisement deleted successfully");

    return new Response(
      JSON.stringify({ success: true, message: 'Advertisement deleted successfully' }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting advertisement:", error.message);
    return new Response(
      JSON.stringify({ success: false, message: 'Error deleting advertisement', error: error.message }),
      { status: 500 }
    );
  }
}
