import { DocumentType, getModelForClass, modelOptions, prop, ReturnModelType } from '@typegoose/typegoose';

@modelOptions({ schemaOptions: { timestamps: true } })
export class ProductSchema {
  @prop({ required: true })
  name!: string;

  @prop({ required: true })
  price!: number;

  @prop({ required: true })
  description!: string;
}

export const Product = getModelForClass(ProductSchema);

export type ProductDocument = DocumentType<ProductSchema>;

export type ProductModel = ReturnModelType<typeof ProductSchema>;
