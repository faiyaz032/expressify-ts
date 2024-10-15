import { z } from 'zod';

// Assuming you have an objectId schema (replace this with actual validation logic)
export const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'Invalid ObjectId' });

// Universal ObjectId Param Schema
export const objectIdParamSchema = z.object({
  id: objectId,
});

export type ObjectIdType = z.infer<typeof objectIdParamSchema>['id'];
