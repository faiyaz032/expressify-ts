import { z } from 'zod';

// Validator for creating a product

// Validator for updating a product
export const createProductSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  price: z.number().positive({ message: 'Price must be a positive number' }),
  description: z.string().min(1, { message: 'Description is required' }),
});

export const updateProductSchema = createProductSchema.partial();

// Define schema for query params (pagination, search, etc.)
export const getAllProductsQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
});

// Export the types inferred from Zod
export type CreateProductType = z.infer<typeof createProductSchema>;
export type UpdateProductType = z.infer<typeof updateProductSchema>;
export type GetAllProductsQueryType = z.infer<typeof getAllProductsQuerySchema>;
