import dbConnect from "@/app/lib/dbConnect";
import CategoryModel from "@/app/models/category";

export async function PUT(req) {
  try {
    await dbConnect();

    const categoriesToUpdate = await CategoryModel.find({
      categoryid: { $exists: false },
    });

    if (categoriesToUpdate.length === 0) {
      return new Response(
        JSON.stringify({ message: "All categories already have categoryid" }),
        { status: 200 }
      );
    }

    const lastCategoryWithId = await CategoryModel.findOne({
      categoryid: { $exists: true },
    }).sort({ categoryid: -1 });

    let nextcategoryid = 1;

    if (
      lastCategoryWithId &&
      typeof lastCategoryWithId.categoryid === "number" &&
      !isNaN(lastCategoryWithId.categoryid)
    ) {
      nextcategoryid = lastCategoryWithId.categoryid + 1;
    }

    for (const category of categoriesToUpdate) {
      await CategoryModel.updateOne(
        { _id: category._id },
        { $set: { categoryid: nextcategoryid++ } }
      );
    }

    return new Response(
      JSON.stringify({
        message: "categoryid assigned successfully",
        updatedCount: categoriesToUpdate.length,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error assigning categoryid",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
