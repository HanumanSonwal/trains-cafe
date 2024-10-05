// // app/api/users/route.js
// import dbConnect from '../../lib/dbConnect';
// import CategoryModel from '../../models/category';
// import { requireRole } from '../../utils/auth';

// // export async function handler(req, res) {
// //   if (await requireRole(req, res, 'ADMIN')) {
// //     // Your protected logic here
// //     res.status(200).json({ message: 'Welcome Admin' });
// //   }
// // }

// // export async function GET(req, res) {
// //     try {
// //       await dbConnect();
// //       const categories = await CategoryModel.find({});
// //       return new Response(JSON.stringify(categories), { status: 200 });
// //     } catch (error) {
// //       return new Response(JSON.stringify({ message: 'Error fetching categories' }), { status: 500 });
// //     }
// // }

// export async function GET(req) {
//   try {
//       const url = new URL(req.url);
//       const search = url.searchParams.get('search') || '';
//       const page = parseInt(url.searchParams.get('page'), 10) || 1;
//       const limit = parseInt(url.searchParams.get('limit'), 10) || 10;

//       await dbConnect();

//       // Create search criteria
//       const searchCriteria = search ? {
//           $or: [
//               { title: { $regex: search, $options: 'i' } },
             
//           ]
//       } : {};

//       // Calculate pagination
//       const skip = (page - 1) * limit;

//       const categories = await CategoryModel.find(searchCriteria)
//           .skip(skip)
//           .limit(limit);

//       const total = await CategoryModel.countDocuments(searchCriteria);

//       return new Response(
//           JSON.stringify({
//               success: true,
//               data: categories,
//               total,
//               page,
//               totalPages: Math.ceil(total / limit)
//           }),
//           { status: 200 }
//       );
//   } catch (error) {
//       return new Response(
//           JSON.stringify({ success: false, message: 'Error fetching vendors' }),
//           { status: 500 }
//       );
//   }
// }

// export async function GET(req, res) {
//     try {
//       await dbConnect();
//       const categories = await CategoryModel.find({});
//       return new Response(JSON.stringify(categories), { status: 200 });
//     } catch (error) {
//       return new Response(JSON.stringify({ message: 'Error fetching categories' }), { status: 500 });
//     }
// }

export async function GET(req) {
  try {
      const url = new URL(req.url);
      const search = url.searchParams.get('search') || '';
      const page = parseInt(url.searchParams.get('page'), 10) || 1;
      const limit = parseInt(url.searchParams.get('limit'), 10) || 10;

      await dbConnect();

      // Create search criteria
      const searchCriteria = search ? {
          $or: [
              { title: { $regex: search, $options: 'i' } },
             
          ]
      } : {};

      // Calculate pagination
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
              totalPages: Math.ceil(total / limit)
          }),
          { status: 200 }
      );
  } catch (error) {
      return new Response(
          JSON.stringify({ success: false, message: 'Error fetching vendors' }),
          { status: 500 }
      );
  }
}

async function generateCategoryId() {
  const lastCategory = await CategoryModel.findOne().sort({ Category_Id: -1 }).exec();
  
  if (!lastCategory) {
      return 'c1'; // Start with 'c1' if no categories exist
  }

  // Extract the numeric part and convert it to an integer
  const lastId = parseInt(lastCategory.Category_Id.slice(1), 10); // Get the number after 'c'
  let nextId = lastId + 1; // Increment the numeric part
  let newCategoryId = `c${nextId}`; // Use let for newCategoryId
  
  while (await CategoryModel.exists({ Category_Id: newCategoryId })) {
      nextId++;
      newCategoryId = `c${nextId}`; // Create a new ID with the incremented number
  }

  return newCategoryId; // Return the new unique Category_Id
}

export async function POST(req) {
  try {
      const formData = await req.formData();
      const body = Object.fromEntries(formData.entries());
      
      await dbConnect();
      // Generate new Category_Id
      body.Category_Id = await generateCategoryId();
      
      const newCategory = new CategoryModel(body);
      await newCategory.save();
      return new Response(JSON.stringify(newCategory), { status: 201 });
  } catch (error) {
      return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}
// export async function POST(req, res) {
//     try {
//       //const body = await req.json();
//       const formData = await req.formData();
//       const body = Object.fromEntries(formData.entries());
      
//       await dbConnect();
//       // Generate new Category_Id
//       body.Category_Id = await generateCategoryId();
      
//       const newCategory = new CategoryModel(body);
//       await newCategory.save();
//       return new Response(JSON.stringify(newCategory), { status: 201 });
//   } catch (error) {
//       return new Response(JSON.stringify({ message: error.message }), { status: 500 });
//   }
// }
// // export async function POST(req, res) {
// //     try {
// //       //const body = await req.json();
// //       const formData = await req.formData();
// //       const body = Object.fromEntries(formData.entries());
      

// //       await dbConnect();
// //       const newCategory = new CategoryModel(body);
// //       await newCategory.save();
// //       return new Response(JSON.stringify(newCategory), { status: 201 });
// //     } catch (error) {
// //       return new Response(JSON.stringify({ message: error.message }), { status: 500 });
// //     }
// // }


// export async function PUT(req) {
//   try {
//       const { searchParams } = new URL(req.url);
//       const id = searchParams.get('id');
//      // const updateData = await req.json(); 
//       const formData = await req.formData();
//       const updateData = Object.fromEntries(formData.entries());

//       if (!id) {
//           return new Response(JSON.stringify({ success: false, message: 'Category ID is required' }), { status: 400 });
//       }

//       await dbConnect();
//       const updatedCategory = await CategoryModel.findByIdAndUpdate(id, updateData, { new: true });
      
//       if (!updatedCategory) {
//           return new Response(JSON.stringify({ success: false, message: 'Category not found' }), { status: 404 });
//       }

//       return new Response(JSON.stringify({ success: true, message: 'Category updated successfully', data: updatedCategory }), { status: 200 });
//   } catch (error) {
//       return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
//   }
// }


// export async function DELETE(req) {
//   try {
//       const { id } = await req.json();

//       if (!id) {
//           return new Response(JSON.stringify({ success: false, message: 'Category ID is required' }), { status: 400 });
//       }

//       await dbConnect();
//       const deletedCategory = await CategoryModel.findByIdAndDelete(id);
//       if (!deletedCategory) {
//           return new Response(JSON.stringify({ success: false, message: 'Category not found' }), { status: 404 });
//       }

//       return new Response(JSON.stringify({ success: true, message: 'Category deleted successfully' }), { status: 200 });
//   } catch (error) {
//       return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
//   }
// }


import dbConnect from '../../lib/dbConnect';
import CategoryModel from '../../models/category';

// Generate incremental Category_Id like 'c1', 'c2', 'c3', etc.
async function generateCategoryId() {
    const lastCategory = await CategoryModel.findOne().sort({ Category_Id: -1 }).exec();

    // If no category exists, start with 'c1'
    if (!lastCategory || !lastCategory.Category_Id) {
        return 'c1';
    }

    // Extract the number part from the last Category_Id and increment it
    const lastIdNumber = parseInt(lastCategory.Category_Id.replace('c', ''), 10);
    const nextId = lastIdNumber + 1;

    // Return the new Category_Id
    return `c${nextId}`;
}

// GET request - Fetch all categories with pagination and search
export async function GET(req) {
    try {
        const url = new URL(req.url);
        const search = url.searchParams.get('search') || '';
        const page = parseInt(url.searchParams.get('page'), 10) || 1;
        const limit = parseInt(url.searchParams.get('limit'), 10) || 10;

        await dbConnect();

        // Create search criteria
        const searchCriteria = search ? {
            $or: [{ title: { $regex: search, $options: 'i' } }]
        } : {};

        // Pagination
        const skip = (page - 1) * limit;
        const categories = await CategoryModel.find(searchCriteria).skip(skip).limit(limit);
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
            JSON.stringify({ success: false, message: 'Error fetching categories' }),
            { status: 500 }
        );
    }
}

// POST request - Create a new category with auto-generated Category_Id
export async function POST(req) {
    try {
        const formData = await req.formData();
        const body = Object.fromEntries(formData.entries());

        await dbConnect();

        // Generate new Category_Id
        body.Category_Id = await generateCategoryId();

        // Create a new category
        const newCategory = new CategoryModel(body);
        await newCategory.save();

        return new Response(JSON.stringify(newCategory), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
}

// PUT request - Update a category by its ID
export async function PUT(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        const formData = await req.formData();
        const updateData = Object.fromEntries(formData.entries());

        if (!id) {
            return new Response(JSON.stringify({ success: false, message: 'Category ID is required' }), { status: 400 });
        }

        await dbConnect();
        const updatedCategory = await CategoryModel.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedCategory) {
            return new Response(JSON.stringify({ success: false, message: 'Category not found' }), { status: 404 });
        }

        return new Response(JSON.stringify({ success: true, message: 'Category updated successfully', data: updatedCategory }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
    }
}

// DELETE request - Delete a category by its ID
export async function DELETE(req) {
    try {
        const { id } = await req.json();

        if (!id) {
            return new Response(JSON.stringify({ success: false, message: 'Category ID is required' }), { status: 400 });
        }

        await dbConnect();
        const deletedCategory = await CategoryModel.findByIdAndDelete(id);

        if (!deletedCategory) {
            return new Response(JSON.stringify({ success: false, message: 'Category not found' }), { status: 404 });
        }

        return new Response(JSON.stringify({ success: true, message: 'Category deleted successfully' }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
    }
}

