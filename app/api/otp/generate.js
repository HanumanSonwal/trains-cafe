import { sendOTP } from '../../../lib/otp';

export default async function handler(req, res) {
  const { phoneNumber } = req.body;
  try {
    await sendOTP(phoneNumber);
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send OTP' });
  }
}
