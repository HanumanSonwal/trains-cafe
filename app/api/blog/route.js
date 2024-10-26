import dbConnect from '@/app/lib/dbConnect';
import Blog from '@/app/models/blog';
import { NextResponse } from 'next/server';
import slugify from 'slugify';

export async function POST(req) { 
    try {
            await dbConnect();

        const { title, description, image, content,metakeyword,metatitle,metadescription } = await req.json();

        const slug = slugify(title, { lower: true, strict: true });
        
        const blog = new Blog({
            
            slug,
            title,
            description,
            image,
            content,
            metakeyword,
            metatitle,
            metadescription

        });

     const result =  await blog.save();

        return NextResponse.json({
            message: 'Blog added successfully',
            data: { result },
        });

    } catch (error) {
        return NextResponse.json({
            message: 'An error occurred',
            error: error.message,
        }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const page = searchParams.get("page") || 1;
        const limit = searchParams.get("limit") || 10;        
        

    const options = {
       page: parseInt(page, 10),
       limit: parseInt(limit, 10),
       sort: { createdAt: -1 }, 
     };

     const result = await Blog.paginate({}, options);

   return NextResponse.json(
        result
   );
    } catch (error) {
        return NextResponse.json({
            message: 'An error occurred',
            error: error.message,
        }, { status: 500 });
        
    }


}

export async function DELETE(req) {
    try {
      await dbConnect();
  
      // Extract the id from the query parameters
      const id = req.nextUrl.searchParams.get('id');
  
      if (!id) {
        return NextResponse.json({
          message: 'Blog ID is required',
        }, { status: 400 });
      }
  
      const result = await Blog.deleteOne({ _id: id });
  
      if (result.deletedCount === 0) {
        return NextResponse.json({
          message: 'Blog not found or already deleted',
        }, { status: 404 });
      }
  
      return NextResponse.json({
        message: 'Blog deleted successfully',
      });
  
    } catch (error) {
      return NextResponse.json({
        message: 'An error occurred',
        error: error.message,
      }, { status: 500 });
    }
  }

  
  export async function PUT(req) {
      try {
          await dbConnect();
  
          // Extract the id from the query parameters
          const id = req.nextUrl.searchParams.get('id');
  
          if (!id) {
              return NextResponse.json({
                  message: 'Web page ID is required',
              }, { status: 400 });
          }
  
          const { name, title, description, keywords, pageData, status } = await req.json();
  
          // Generate a slug from the title
          const slug = slugify(title, { lower: true, strict: true });
  
          // Find the existing web page by ID
          const blog = await Blog.findById(id);
          if (!blog) {
              return NextResponse.json({
                  message: 'Web page not found',
              }, { status: 404 });
          }
  
          // Update the web page fields
          blog.name = name;
          blog.title = title;
          blog.slug = slug;
          blog.description = description;
          blog.keywords = keywords;
          blog.pageData = pageData;
          blog.status = status;
  
          // Save the updated web page
          await blog.save();
  
          return NextResponse.json({
              message: 'Blog page updated successfully',
              data: { blog },
          });
      } catch (error) {
          return NextResponse.json({
              message: 'An error occurred',
              error: error.message,
          }, { status: 500 });
      }
  }
  