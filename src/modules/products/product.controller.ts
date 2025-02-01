import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { injectable } from 'tsyringe';
import { Controller, Delete, Get, Patch, Post } from '../../lib/core/decorators';
import { ObjectIdType } from '../../shared/schemas/objectId.schema';
import sendResponse from '../../shared/utils/sendResponse';
import { CreateProductType } from './product.schema';
import ProductService from './product.service';

@injectable()
@Controller('/api/v1/products')
export default class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('/')
  async createProduct(req: Request, res: Response) {
    const data = req.body as CreateProductType;
    const product = await this.productService.create(data);
    sendResponse(res, StatusCodes.CREATED, 'Product created successfully', product);
  }

  @Get('/')
  async getAllProducts(req: Request, res: Response) {
    const result = await this.productService.getAll(req.query);
    sendResponse(res, StatusCodes.OK, 'Products retrieved successfully', result.data, result.pagination);
  }

  @Get('/:id')
  async getProductById(req: Request, res: Response) {
    const id = req.params.id as ObjectIdType;
    const product = await this.productService.getOneById(id);
    sendResponse(res, StatusCodes.OK, 'Product retrieved successfully', product);
  }

  @Patch('/:id')
  async updateProduct(req: Request, res: Response) {
    const id = req.params.id as ObjectIdType;

    const product = await this.productService.updateById(id, req.body);
    sendResponse(res, StatusCodes.OK, 'Product updated successfully', product);
  }

  @Delete('/:id')
  async deleteProduct(req: Request, res: Response) {
    const id = req.params.id as ObjectIdType;
    await this.productService.deleteById(id);
    sendResponse(res, StatusCodes.OK, 'Product deleted successfully');
  }
}
