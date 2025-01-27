import { StatusCodes } from 'http-status-codes';
import { FilterQuery } from 'mongoose';
import { PaginatedResult } from '../../core/types/common.types';
import CustomError from '../../shared/error-handling/CustomError';
import logger from '../../shared/logger/LoggerManager';
import { ObjectIdType } from '../../shared/schemas/objectId.schema'; // Import ObjectIdType
import { ProductDocument } from './product.model'; // Product document interface
import ProductRepository from './product.repository'; // Import the Product repository
import { CreateProductType, UpdateProductType } from './product.schema'; // Zod schema types

class ProductService {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  // Create a new Product
  createProduct = async (data: CreateProductType): Promise<ProductDocument> => {
    try {
      const productExists = await this.productRepository.findOne({ name: data.name });
      if (productExists) {
        throw new CustomError(StatusCodes.CONFLICT, 'Product with this name already exists');
      }

      const product = await this.productRepository.create(data);
      return product;
    } catch (error: any) {
      logger.error(`Error in createProduct: ${error.message}`, { error });
      throw error;
    }
  };

  // Get Product by id
  getProductById = async (id: ObjectIdType): Promise<ProductDocument | null> => {
    try {
      const product = await this.productRepository.findById(id);

      if (!product) {
        throw new CustomError(StatusCodes.NOT_FOUND, `Product with id ${id} not found`);
      }

      return product;
    } catch (error: any) {
      logger.error(`Error in getProductById: ${error.message}`, { error });
      throw error;
    }
  };

  // Find Product by any criteria (e.g., name, category)
  findProduct = async (query: FilterQuery<ProductDocument>): Promise<ProductDocument | null> => {
    try {
      const product = await this.productRepository.findOne(query);

      if (!product) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'Product not found');
      }

      return product;
    } catch (error: any) {
      logger.error(`Error in findProduct: ${error.message}`, { error });
      throw error;
    }
  };

  // Update Product by id
  updateProduct = async (id: ObjectIdType, data: UpdateProductType): Promise<ProductDocument | null> => {
    try {
      const updatedProduct = await this.productRepository.updateById(id, data);

      if (!updatedProduct) {
        throw new CustomError(StatusCodes.NOT_FOUND, `Failed to update product with id ${id}`);
      }

      return updatedProduct;
    } catch (error: any) {
      logger.error(`Error in updateProduct: ${error.message}`, { error });
      throw error;
    }
  };

  // Delete Product by id
  deleteProduct = async (id: ObjectIdType): Promise<ProductDocument | null> => {
    try {
      const deletedProduct = await this.productRepository.deleteById(id);

      if (!deletedProduct) {
        throw new CustomError(StatusCodes.NOT_FOUND, `Failed to delete product with id ${id}`);
      }

      return deletedProduct;
    } catch (error: any) {
      logger.error(`Error in deleteProduct: ${error.message}`, { error });
      throw error;
    }
  };

  // Optional: Find multiple products based on a query
  findAllProducts = async (query: FilterQuery<ProductDocument>): Promise<PaginatedResult<ProductDocument>> => {
    try {
      return await this.productRepository.findAll(query);
    } catch (error: any) {
      logger.error(`Error in findAllProducts: ${error.message}`, { error });
      throw error;
    }
  };
}

export default ProductService;
