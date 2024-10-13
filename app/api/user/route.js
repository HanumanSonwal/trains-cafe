import dbConnect from '@/app/lib/dbConnect';
import UserModel from '@/app/models/user';

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
                { name: { $regex: search, $options: 'i' } }
            ]
        } : {};

        // Calculate pagination
        const skip = (page - 1) * limit;

        const users = await UserModel.find(searchCriteria)
            .skip(skip)
            .limit(limit);

        const total = await UserModel.countDocuments(searchCriteria);

        return new Response(
            JSON.stringify({
                success: true,
                data: users,
                total,
                page,
                totalPages: Math.ceil(total / limit)
            }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ success: false, message: 'Error fetching users' }),
            { status: 500 }
        );
    }
}