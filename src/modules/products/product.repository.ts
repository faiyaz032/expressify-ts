import { StatusCodes } from 'http-status-codes';
import { FilterQuery } from 'mongoose';
import CustomError from '../../shared/error-handling/CustomError';
import logger from '../../shared/logger/LoggerManager';
import { ObjectIdType } from '../../shared/schemas/objectId.schema'; // Import the ObjectIdType
import { Product, ProductDocument } from './product.model'; // Import the Product model
import { CreateProductType, UpdateProductType } from './product.schema'; // Import the Zod validation types

export default class ProductRepository {
  private repository = Product;

  // Create a new Product document
  create = async (data: CreateProductType): Promise<ProductDocument> => {
    try {
      const newProduct = new this.repository(data);
      return await newProduct.save();
    } catch (error: any) {
      logger.error(`Failed to create product: ${error.message}`, { error });
      throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to create product. Please try again later.');
    }
  };

  // Get Product document by id
  findById = async (id: ObjectIdType): Promise<ProductDocument | null> => {
    try {
      return await this.repository.findById(id).exec();
    } catch (error: any) {
      logger.error(`Failed to find product by id: ${error.message}`, { error });
      throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to find product. Please try again later.');
    }
  };

  // Find Product by any criteria (e.g., name, price, etc.)
  findOne = async (query: FilterQuery<ProductDocument>): Promise<ProductDocument | null> => {
    try {
      return await this.repository.findOne(query).exec();
    } catch (error: any) {
      logger.error(`Failed to find product: ${error.message}`, { error });
      throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to find product. Please try again later.');
    }
  };

  // Update Product document by id
  updateById = async (id: ObjectIdType, data: UpdateProductType): Promise<ProductDocument | null> => {
    try {
      return await this.repository.findByIdAndUpdate(id, data, { new: true }).exec();
    } catch (error: any) {
      logger.error(`Failed to update product by id: ${error.message}`, { error });
      throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to update product. Please try again later.');
    }
  };

  // Delete Product document by id
  deleteById = async (id: ObjectIdType): Promise<ProductDocument | null> => {
    try {
      return await this.repository.findByIdAndDelete(id).exec();
    } catch (error: any) {
      logger.error(`Failed to delete product by id: ${error.message}`, { error });
      throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to delete product. Please try again later.');
    }
  };

  // Optional: Find multiple products based on a query (e.g., for listing products)
  findAll = async (query: FilterQuery<ProductDocument>): Promise<ProductDocument[]> => {
    try {
      return await this.repository.find(query).exec();
    } catch (error: any) {
      logger.error(`Failed to find products: ${error.message}`, { error });
      throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to find products. Please try again later.');
    }
  };
}
