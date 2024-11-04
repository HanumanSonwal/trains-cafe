import dbConnect from '../../lib/dbConnect';
import ContactRequestModel from '../../models/contactRequest';
export async function POST(req) {
  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get('slug') || url.pathname.split('/').pop(); // Updated to handle query params
    console.log('POST request received. URL:', req.url);
    console.log('Extracted slug:', slug);

    const validSlugs = ['Hotel', 'Coolie', 'BulkOrder','ContactUs'];
    if (!validSlugs.includes(slug)) {
      console.error('Invalid slug:', slug);
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid slug' }),
        { status: 400 }
      );
    }

    const { Name, ContactNumber, Email, Message } = await req.json();
    console.log('Request payload:', { Name, ContactNumber, Email, Message });

    if (!Name || !ContactNumber || !Email || !Message) {
      console.error('Missing required fields:', { Name, ContactNumber, Email, Message });
      return new Response(
        JSON.stringify({ success: false, message: 'All fields are required' }),
        { status: 400 }
      );
    }

    await dbConnect();
    console.log('Connected to database');

    const newContactRequest = new ContactRequestModel({
      slug,
      Name,
      ContactNumber,
      Email,
      Message,
    });
    console.log('New contact request:', newContactRequest);

    await newContactRequest.save();
    console.log('Contact request saved successfully');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Contact request submitted successfully',
        data: newContactRequest,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Error submitting contact request' }),
      { status: 500 }
    );
  }
}

// export async function POST(req) {
//   try {
//     const url = new URL(req.url);
//     const slug = url.pathname.split('/').pop();
//     console.log('POST request received. URL:', req.url);
//     console.log('Extracted slug:', slug);

//     const validSlugs = ['Hotel', 'Coolie', 'BulkOrder'];
//     if (!validSlugs.includes(slug)) {
//       console.error('Invalid slug:', slug);
//       return new Response(
//         JSON.stringify({ success: false, message: 'Invalid slug' }),
//         { status: 400 }
//       );
//     }

//     const { Name, ContactNumber, Email, Message } = await req.json();
//     console.log('Request payload:', { Name, ContactNumber, Email, Message });

//     if (!Name || !ContactNumber || !Email || !Message) {
//       console.error('Missing required fields:', { Name, ContactNumber, Email, Message });
//       return new Response(
//         JSON.stringify({ success: false, message: 'All fields are required' }),
//         { status: 400 }
//       );
//     }

//     await dbConnect();
//     console.log('Connected to database');

//     const newContactRequest = new ContactRequestModel({
//       slug,
//       Name,
//       ContactNumber,
//       Email,
//       Message,
//     });
//     console.log('New contact request:', newContactRequest);

//     await newContactRequest.save();
//     console.log('Contact request saved successfully');

//     return new Response(
//       JSON.stringify({
//         success: true,
//         message: 'Contact request submitted successfully',
//         data: newContactRequest,
//       }),
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error('Error in POST:', error);
//     return new Response(
//       JSON.stringify({ success: false, message: 'Error submitting contact request' }),
//       { status: 500 }
//     );
//   }
// }
// export async function GET(req) {
//   try {
//     const url = new URL(req.url);
//     //const slug = url.pathname.split('/').pop();
//     const slug = url.searchParams.get('slug') || url.pathname.split('/').pop(); 
//     const validSlugs = ['Hotel', 'Coolie', 'BulkOrder','ContactUs'];
//     if (!validSlugs.includes(slug)) {
//       return new Response(
//         JSON.stringify({ success: false, message: 'Invalid slug' }),
//         { status: 400 }
//       );
//     }

//     await dbConnect();

//     const contactRequests = await ContactRequestModel.find({ slug });

//     return new Response(
//       JSON.stringify({
//         success: true,
//         data: contactRequests,
//       }),
//       { status: 200 }
//     );
//   } catch (error) {
//     return new Response(
//       JSON.stringify({ success: false, message: 'Error fetching contact requests' }),
//       { status: 500 }
//     );
//   }
// }
export async function GET(req) {
  try {
    const url = new URL(req.url);
    let slug = url.searchParams.get('slug')?.trim(); // Get slug only from query parameters, and trim whitespace

    const validSlugs = ['Hotel', 'Coolie', 'BulkOrder', 'ContactUs'];

    // If slug is provided (non-empty) and is not in the valid list, return an error
    if (slug && !validSlugs.includes(slug)) {
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid slug' }),
        { status: 400 }
      );
    }

    await dbConnect();

    // If slug is empty or undefined, retrieve all data; otherwise, filter by slug
    const contactRequests = slug
      ? await ContactRequestModel.find({ slug })
      : await ContactRequestModel.find({});

    return new Response(
      JSON.stringify({
        success: true,
        data: contactRequests,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: 'Error fetching contact requests' }),
      { status: 500 }
    );
  }
}
export async function PUT(req) {
  try {
    const url = new URL(req.url);
    //const slug = url.pathname.split('/').pop();
    const slug = url.searchParams.get('slug') || url.pathname.split('/').pop(); 
    const requestId = url.searchParams.get('id');
    const validSlugs = ['Hotel', 'Coolie', 'BulkOrder','ContactUs'];
    if (!validSlugs.includes(slug)) {
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid slug' }),
        { status: 400 }
      );
    }

    const { Name, ContactNumber, Email, Message } = await req.json();
    if (!Name || !ContactNumber || !Email || !Message) {
      return new Response(
        JSON.stringify({ success: false, message: 'All fields are required' }),
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
        JSON.stringify({ success: false, message: 'Contact request not found' }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Contact request updated successfully',
        data: updatedRequest,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: 'Error updating contact request' }),
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    //const slug = url.pathname.split('/').pop();
    const slug = url.searchParams.get('slug') || url.pathname.split('/').pop(); 
    const requestId = url.searchParams.get('id');
    const validSlugs = ['Hotel', 'Coolie', 'BulkOrder' ,'ContactUs'];
    if (!validSlugs.includes(slug)) {
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid slug' }),
        { status: 400 }
      );
    }

    await dbConnect();

    const deletedRequest = await ContactRequestModel.findByIdAndDelete(requestId);

    if (!deletedRequest) {
      return new Response(
        JSON.stringify({ success: false, message: 'Contact request not found' }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Contact request deleted successfully',
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: 'Error deleting contact request' }),
      { status: 500 }
    );
  }
}
