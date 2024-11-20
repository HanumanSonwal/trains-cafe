import dbConnect from '@/app/lib/dbConnect';
import OtpModel from '@/app/models/otp';

export async function POST(req) {
  try {
    await dbConnect();

    const { otp, email } = await req.json();
    const otpRecord = await OtpModel.findOne({email});

    if(!otpRecord){
        return new Response(JSON.stringify({error: "OTP not found or expired"}),{
            status: 404,
            headers: {'Content-Type': 'application/json'}
        });
    }

    console.log(otpRecord.otp === otp, "bool");
    if(otpRecord.otp == otp){
        await OtpModel.deleteOne({email});

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
