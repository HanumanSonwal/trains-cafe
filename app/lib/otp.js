import { sendSMS } from 'some-sms-service';

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOTP = async (phoneNumber) => {
  const otp = generateOTP();
  await sendSMS(phoneNumber, `Your OTP is ${otp}`);
  // Save OTP in your database or cache
};

export const verifyOTP = async (phoneNumber, inputOTP) => {
  // Logic to verify the OTP
};
