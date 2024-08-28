// schemas/formSchema.js
// schemas/formSchema.js
// import { z } from 'zod';

// export const MenuItemSchema = z.object({
//   itemName: z.string().min(1, 'Item Name is required'),
//   image: z.string().min(1, 'Image is required'), // Assuming image is a URL or base64 string
//   category: z.string().min(1, 'Category is required'),
//   vendor: z.string().min(1, 'Vendor is required'),
//   price: z.number().min(0, 'Price must be a positive number'),
//   discount: z.number().min(0, 'Discount must be a positive number'),
//   foodType: z.string().min(1, 'Food Type is required'),
//   description: z.string().min(1, 'Description is required'),
// });

// schemas/formSchema.js
import { z } from 'zod';

export const MenuItemSchema = z.object({
    itemName: z.string().min(1, 'Item Name is required'),
  category: z.string().min(1, 'Category is required'),
  vendor: z.string().min(1, 'Vendor is required'),
  price: z.preprocess(val => {
    const num = Number(val);
    return isNaN(num) ? 0 : num;
  }, z.number().min(0, 'Price must be a positive number')),
  discount: z.preprocess(val => {
    const num = Number(val);
    return isNaN(num) ? 0 : num;
  }, z.number().min(0, 'Discount must be a positive number')),
  foodType: z.string().min(1, 'Food Type is required'),
  description: z.string().min(1, 'Description is required'),
});
