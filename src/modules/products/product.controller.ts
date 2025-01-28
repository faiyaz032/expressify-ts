import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ObjectIdType } from '../../shared/schemas/objectId.schema';
import sendResponse from '../../shared/utils/sendResponse';
import { CreateProductType, UpdateProductType } from './product.schema';
import ProductService from './product.service';

export default class ProductController {
  constructor(private readonly productService: ProductService) {}

  createProduct = async (req: Request, res: Response) => {
    const data = req.body as CreateProductType;
    const product = await this.productService.create(data);
    sendResponse(res, StatusCodes.CREATED, 'Product created successfully', product);
  };

  getAllProducts = async (req: Request, res: Response) => {
    const result = await this.productService.getAll(req.query);
    sendResponse(res, StatusCodes.OK, 'Products retrieved successfully', result.data, result.pagination);
  };

  getProductById = async (req: Request, res: Response) => {
    const id = req.params.id as ObjectIdType;
    const product = await this.productService.getOneById(id);
    sendResponse(res, StatusCodes.OK, 'Product retrieved successfully', product);
  };

  updateProduct = async (req: Request, res: Response) => {
    const id = req.params.id as ObjectIdType;
    const data = req.body as UpdateProductType;
    const product = await this.productService.updateById(id, data);
    sendResponse(res, StatusCodes.OK, 'Product updated successfully', product);
  };

  deleteProduct = async (req: Request, res: Response) => {
    const id = req.params.id as ObjectIdType;
    await this.productService.deleteById(id);
    sendResponse(res, StatusCodes.OK, 'Product deleted successfully');
  };
}
