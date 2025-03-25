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
        /^(0?[1-9]|1[0-2]):([0-5]\d) (AM|PM)$/,
        'Start time must be in hh:mm AM/PM format'
      ),
      end: z.string().regex(
        /^(0?[1-9]|1[0-2]):([0-5]\d) (AM|PM)$/,
        'End time must be in hh:mm AM/PM format'
      ),
    })
      .refine(
        ({ start, end }) => {
          const parseTime = (time) => {
            const [_, hours, minutes, period] = time.match(/(\d{1,2}):(\d{2}) (AM|PM)/);
            let hours24 = period === 'PM' && hours !== '12' ? parseInt(hours) + 12 : parseInt(hours);
            hours24 = period === 'AM' && hours === '12' ? 0 : hours24;
            return new Date(`1970-01-01T${hours24.toString().padStart(2, '0')}:${minutes}:00`);
          };
    
          return parseTime(end) > parseTime(start);
        },
        { message: 'End time must be later than start time' }
      )
      .transform(({ start, end }) => `${start} - ${end}`),
    
  Weekly_Off: z.string().nonempty('Please select the weekly off day'),
  Food_Type: z.string().nonempty('Please select the food type'),
  Description: z.string().nonempty('Please enter a description'),
  Address: z.string().nonempty('Please enter the address'),
  Station: z.string().nonempty('Please select a station'),
});
