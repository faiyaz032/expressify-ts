// Utility function to ensure fields are in array format
export function toArray(field: any): string[] {
  return Array.isArray(field) ? field : typeof field === 'string' ? [field] : [];
}
