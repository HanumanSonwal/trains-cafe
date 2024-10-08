import dbConnect from '@/app/lib/dbConnect';
import StationModel from '@/app/models/station';

export async function GET(req, { params }) {
    const { id } = params;
    try {

        await dbConnect();

        const stations = await StationModel.findById(id);

        return new Response(
            JSON.stringify({
                success: true,
                data: stations
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

export async function DELETE(req, { params }) {
    const { id } = params;
    try {

        if (!id) {
            return new Response(JSON.stringify({ success: false, message: 'Station ID is required' }), { status: 400 });
        }

        await dbConnect();
        const deletedStation = await StationModel.findByIdAndDelete(id);
        if (!deletedStation) {
            return new Response(JSON.stringify({ success: false, message: 'Station not found' }), { status: 404 });
        }

        return new Response(JSON.stringify({ success: true, message: 'Station deleted successfully' }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
    }
}