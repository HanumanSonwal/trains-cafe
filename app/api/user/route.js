import dbConnect from '@/app/lib/dbConnect';
import UserModel from '@/app/models/user';
import { getStaff } from '@/app/lib/sessionPermission';
import { isAdmin } from '@/app/lib/rbac';

// Old "Managers" list. Admin only, and the password hash is never sent.
// New code should use /api/admin/users.
export async function GET(req) {
    try {
        if (!isAdmin(await getStaff(req))) {
            return new Response(JSON.stringify({ success: false, message: 'Not allowed' }), { status: 403 });
        }
        const url = new URL(req.url);
        const search = (url.searchParams.get('search') || '').trim().slice(0, 60);
        const page = Math.max(1, parseInt(url.searchParams.get('page'), 10) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit'), 10) || 10));

        await dbConnect();

        const rx = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const searchCriteria = search ? { name: { $regex: rx, $options: 'i' } } : {};

        const [users, total] = await Promise.all([
            UserModel.find(searchCriteria).select('-password').skip((page - 1) * limit).limit(limit).lean(),
            UserModel.countDocuments(searchCriteria),
        ]);

        return new Response(
            JSON.stringify({ success: true, data: users, total, page, totalPages: Math.ceil(total / limit) }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ success: false, message: 'Error fetching users' }),
            { status: 500 }
        );
    }
}
