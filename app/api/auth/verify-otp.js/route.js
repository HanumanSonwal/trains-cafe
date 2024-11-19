import { getServerSession } from 'next-auth';
import dbConnect from '@/app/lib/dbConnect';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import OtpModel from '@/app/models/otp';

export async function POST(req) {
  try {
    await dbConnect();

    const session = await getServerSession(req, authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const userId = session.user.id;
    const { otp } = await req.json();
    const otpRecord = await OtpModel.findOne({userId});

    if(!otpRecord){
        return new Response(JSON.stringify({error: "OTP not found or expired"}),{
            status: 404,
            headers: {'Content-Type': 'application/json'}
        });
    }

    if(otpRecord.otp === otp){
        await OtpModel.deleteOne({userId});

        return new Response(JSON.stringify({message: "OTP verified successful"}), {
            status: 200,
            headers: {'Content-Type': 'application/json'}
        });
    }
    else{
        return new Response(JSON.stringify({error: "Invalid OTP"}), {
            status: 400,
            headers: {'Content-Type': 'application/json'}
        });
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ error: 'Failed to verify OTP' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
