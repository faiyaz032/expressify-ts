import { DocumentType, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';

@modelOptions({ schemaOptions: { timestamps: true } })
export class ProductSchema {
  @prop({ required: true })
  name!: string;

  @prop({ required: true })
  price!: number;

  @prop({ required: true })
  description!: string;
}

export type ProductDocument = DocumentType<ProductSchema>;
export const Product = getModelForClass(ProductSchema);
