import { z } from 'zod';

// Validator for creating a product
export const createProductSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  price: z.number().positive({ message: 'Price must be a positive number' }),
  description: z.string().min(1, { message: 'Description is required' }),
});

// Validator for updating a product
export const updateProductSchema = z.object({
  name: z.string().min(1, { message: 'Name must be a string' }).optional(),
  price: z.number().positive({ message: 'Price must be a positive number' }).optional(),
  description: z.string().min(1, { message: 'Description must be a string' }).optional(),
});

// Export the types inferred from Zod
export type CreateProductType = z.infer<typeof createProductSchema>;
export type UpdateProductType = z.infer<typeof updateProductSchema>;
