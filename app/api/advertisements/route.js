import dbConnect from '../../lib/dbConnect';
import AdvertisementsModel from '../../models/add';

// GET: Fetch advertisements with search, pagination, and filters
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get('search') || '';
    const page = parseInt(url.searchParams.get('page'), 10) || 1;
    const limit = parseInt(url.searchParams.get('limit'), 10) || 10;

    await dbConnect();

    const searchCriteria = search
      ? {
          $or: [
            { slug: { $regex: search, $options: 'i' } },
            
          ],
        }
      : {};

    const skip = (page - 1) * limit;

    const advertisements = await AdvertisementsModel.find(searchCriteria)
      .skip(skip)
      .limit(limit);

    const total = await AdvertisementsModel.countDocuments(searchCriteria);

    return new Response(
      JSON.stringify({
        success: true,
        data: advertisements,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: 'Error fetching advertisements' }),
      { status: 500 }
    );
  }
}

// POST: Create a new advertisement
// POST: Create a new advertisement
export async function POST(req) {
    try {
      const body = await req.json();
  
      if (!body.title || !body.image || !body.description) {
        return new Response(
          JSON.stringify({ success: false, message: 'Title, image, and description are required' }),
          { status: 400 }
        );
      }
  
      // Validate the slug value
      const allowedSlugs = ['Advertisements', 'Banner'];
      if (!allowedSlugs.includes(body.slug)) {
        return new Response(
          JSON.stringify({ success: false, message: `Invalid slug. Allowed values: ${allowedSlugs.join(', ')}` }),
          { status: 400 }
        );
      }
  
      await dbConnect();
      const newAdvertisement = new AdvertisementsModel(body);
      await newAdvertisement.save();
  
      return new Response(JSON.stringify({ success: true, data: newAdvertisement }), { status: 201 });
    } catch (error) {
      return new Response(
        JSON.stringify({ success: false, message: error.message }),
        { status: 500 }
      );
    }
  }
  

// PUT: Update an existing advertisement
export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const body = await req.json();

    if (!id) {
      return new Response(
        JSON.stringify({ success: false, message: 'Advertisement ID is required' }),
        { status: 400 }
      );
    }

    await dbConnect();
    const updatedAdvertisement = await AdvertisementsModel.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedAdvertisement) {
      return new Response(
        JSON.stringify({ success: false, message: 'Advertisement not found' }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify({ success: true, data: updatedAdvertisement }), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}

// DELETE: Delete an advertisement
export async function DELETE(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return new Response(
        JSON.stringify({ success: false, message: 'Advertisement ID is required' }),
        { status: 400 }
      );
    }

    await dbConnect();
    const deletedAdvertisement = await AdvertisementsModel.findByIdAndDelete(id);

    if (!deletedAdvertisement) {
      return new Response(
        JSON.stringify({ success: false, message: 'Advertisement not found' }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Advertisement deleted successfully' }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}
