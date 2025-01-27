import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ObjectIdType } from '../../shared/schemas/objectId.schema';
import sendResponse from '../../shared/utils/sendResponse';
import { toArray } from '../../shared/utils/toArray';
import { CreateProductType, UpdateProductType } from './product.schema'; // Import your product schema types
import ProductService from './product.service'; // Import your ProductService

class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  // Create a new product
  createProduct = async (req: Request<{}, {}, CreateProductType>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const product = await this.productService.createProduct(req.body);
      sendResponse(res, StatusCodes.CREATED, 'Product created successfully', product);
    } catch (error: any) {
      next(error);
    }
  };

  // Get product by ID
  getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const product = await this.productService.getProductById(id);
      sendResponse(res, StatusCodes.OK, 'Product retrieved successfully', product);
    } catch (error: any) {
      next(error);
    }
  };

  // Get all products with optional filtering
  getAllProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { search, searchFields, page, limit, selectFields, populateFields } = req.query;

      // Prepare query object
      const query = {
        page: page as string,
        limit: limit as string,
        search: search as string,
        searchFields: toArray(searchFields),
        selectFields: toArray(selectFields),
        populateFields: toArray(populateFields),
      };

      const products = await this.productService.findAllProducts(query);

      sendResponse(res, StatusCodes.OK, 'Products retrieved successfully', products.data, products.pagination);
    } catch (error: any) {
      next(error);
    }
  };

  // Update product by ID
  updateProduct = async (
    req: Request<{ id: ObjectIdType }, {}, UpdateProductType>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const updatedProduct = await this.productService.updateProduct(id, req.body);
      sendResponse(res, StatusCodes.OK, 'Product updated successfully', updatedProduct);
    } catch (error: any) {
      next(error);
    }
  };

  // Delete product by ID
  deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const deletedProduct = await this.productService.deleteProduct(id);
      sendResponse(res, StatusCodes.OK, 'Product deleted successfully', deletedProduct);
    } catch (error: any) {
      next(error);
    }
  };
}

export default ProductController;
