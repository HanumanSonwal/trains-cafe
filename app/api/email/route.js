import { getServerSession } from 'next-auth';
import dbConnect from '@/app/lib/dbConnect';
import sendMail from '../../lib/sendEmail';
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

    //OTP generation
    await OtpModel.create({userId, otp});

    console.log(`OTP for user ${userId}: ${otp}`);

    const { to, type } = await req.json();
    let subject, text;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    //OTP generation done
    
    switch (type) {
        case "reset":
          subject = "Reset Password";
          text = `Your OTP is ${otp}`;
          break;
        case "forget":
            subject = "Forget Password";
            text = `Your OTP is ${otp}`;
        default:
          return res
            .status(400)
            .json({ success: false, err: "Invalid email type" });
    }

    // Read the email template file
    // if (!fs.existsSync(templatePath)) {
    //     return res.status(404).json({ message: "Template not found" });
    //   }

    // let template = fs.readFileSync(templatePath, "utf-8");

    // // Replace placeholders with actual values
    // for (const [key, value] of Object.entries(placeholders)) {
    //   template = template.replace(new RegExp(`{{${key}}}`, "g"), value);
    // }

    // Email options
    const mailOptions = {
      to,
      subject,
      html: text,
    };

    // Send the email
    const success = await sendMail(mailOptions);

    // Return success response
    return new Response(JSON.stringify({ message: 'Email sent successfully!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ error: 'Failed to send email' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
