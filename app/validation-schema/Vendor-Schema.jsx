import { z } from 'zod';
const formatTimeWithAmPm = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  const amPm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${amPm}`;
};

export const vendorSchema = z.object({
  Vendor_Name: z.string().nonempty('Please enter the vendor name'),
  Contact_No: z.string().nonempty('Please enter the contact number'),
  Alternate_Contact_No: z.string().optional(),
  Delivery_Charges: z.coerce.number().positive('Please enter positive delivery charges in rupees'),
  Min_Order_Value: z.coerce.number().positive('Please enter the minimum order value in rupees'),
  Min_Order_Time: z.coerce
    .number()
    .min(1, 'Minimum order time must be at least 1 minute')
    .max(60, 'Minimum order time cannot exceed 60 minutes'),
  Working_Time: z.object({
    start: z.string().regex(
      /^([01]\d|2[0-3]):([0-5]\d)$/,
      'Start time must be in HH:mm format (24-hour clock)'
    ),
    end: z.string().regex(
      /^([01]\d|2[0-3]):([0-5]\d)$/,
      'End time must be in HH:mm format (24-hour clock)'
    ),
  })
    .refine(
      ({ start, end }) => new Date(`1970-01-01T${end}:00`) > new Date(`1970-01-01T${start}:00`),
      { message: 'End time must be later than start time' }
    )
    .transform(({ start, end }) => `${formatTimeWithAmPm(start)} - ${formatTimeWithAmPm(end)}`), // Format to include AM/PM
  Weekly_Off: z.string().nonempty('Please select the weekly off day'),
  Food_Type: z.string().nonempty('Please select the food type'),
  Description: z.string().nonempty('Please enter a description'),
  Address: z.string().nonempty('Please enter the address'),
  Station: z.string().nonempty('Please select a station'),
});
