import dbConnect from "@/app/lib/dbConnect";
import sendMail from "../../lib/sendEmail";
import OtpModel from "@/app/models/otp";
import sessionChecker from "@/app/lib/sessionPermission";

export async function POST(req) {
  try {
    const isAuthorized = await sessionChecker(req, "targetApi", true);

    if (!isAuthorized) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    await dbConnect();

    const { to, type } = await req.json();
    let subject, text;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OtpModel.create({ email: to, otp });

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

    const mailOptions = {
      to,
      subject,
      html: text,
    };

    const success = await sendMail(mailOptions);

    return new Response(
      JSON.stringify({ message: "Email sent successfully!" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(JSON.stringify({ error: "Failed to send email" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
