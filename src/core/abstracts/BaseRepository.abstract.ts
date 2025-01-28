import { DocumentType } from '@typegoose/typegoose';
import { StatusCodes } from 'http-status-codes';
import { FilterQuery } from 'mongoose';
import CustomError from '../../shared/error-handling/CustomError';
import logger from '../../shared/logger/LoggerManager';
import { ObjectIdType } from '../../shared/schemas/objectId.schema';
import { calculatePagination } from '../../shared/utils/calculatePagination';
import { PaginatedResult, TypegooseModel } from '../types/common.types';

export abstract class BaseRepository<T, CreateDtoType> {
  protected constructor(protected readonly model: TypegooseModel<T>) {}

  async create(data: CreateDtoType): Promise<DocumentType<T>> {
    try {
      const newDocument = new this.model(data);
      return (await newDocument.save()) as DocumentType<T>;
    } catch (error: any) {
      logger.error(`Failed to create document: ${error.message}`, { error });
      throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to create document. Please try again later.');
    }
  }

  async findById(id: ObjectIdType): Promise<DocumentType<T> | null> {
    try {
      return (await this.model.findById(id).exec()) as DocumentType<T> | null;
    } catch (error: any) {
      logger.error(`Failed to find document by id: ${error.message}`, { error });
      throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to find document. Please try again later.');
    }
  }

  async findOne(query: FilterQuery<T>): Promise<DocumentType<T> | null> {
    try {
      return (await this.model.findOne(query).exec()) as DocumentType<T> | null;
    } catch (error: any) {
      logger.error(`Failed to find document: ${error.message}`, { error });
      throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to find document. Please try again later.');
    }
  }

  async updateById(id: ObjectIdType, data: Partial<DocumentType<T>>): Promise<DocumentType<T> | null> {
    try {
      return (await this.model.findByIdAndUpdate(id, data, { new: true }).exec()) as DocumentType<T> | null;
    } catch (error: any) {
      logger.error(`Failed to update document by id: ${error.message}`, { error });
      throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to update document. Please try again later.');
    }
  }

  async deleteById(id: ObjectIdType): Promise<DocumentType<T> | null> {
    try {
      return (await this.model.findByIdAndDelete(id).exec()) as DocumentType<T> | null;
    } catch (error: any) {
      logger.error(`Failed to delete document by id: ${error.message}`, { error });
      throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to delete document. Please try again later.');
    }
  }

  async findAll(query: FilterQuery<T> = {}): Promise<PaginatedResult<DocumentType<T>>> {
    const {
      page = 1,
      limit = 10,
      search,
      searchFields = '',
      selectFields = '',
      populateFields = '',
      ...cleanQuery
    } = query as any;

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;

    // Convert comma-separated strings to arrays and ensure they're valid
    const searchFieldsArray = typeof searchFields === 'string' ? searchFields.split(',').filter(Boolean) : [];
    const selectFieldsArray = typeof selectFields === 'string' ? selectFields.split(',').filter(Boolean) : [];
    const populateFieldsArray = typeof populateFields === 'string' ? populateFields.split(',').filter(Boolean) : [];

    // Build the final query
    const finalQuery: FilterQuery<T> =
      search && searchFieldsArray.length
        ? {
            $and: [
              cleanQuery,
              { $or: searchFieldsArray.map((field: string) => ({ [field]: { $regex: search, $options: 'i' } })) },
            ],
          }
        : cleanQuery;

    const queryBuilder = this.model
      .find(finalQuery)
      .sort({ createdAt: 'desc' })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    if (selectFieldsArray.length) {
      queryBuilder.select(selectFieldsArray.join(' '));
    }

    if (populateFieldsArray.length) {
      populateFieldsArray.forEach((field: string) => queryBuilder.populate(field));
    }

    const [data, total] = await Promise.all([queryBuilder.exec(), this.model.countDocuments(finalQuery)]);

    return {
      data: data as DocumentType<T>[],
      pagination: calculatePagination({ page: pageNum, limit: limitNum, total }),
    };
  }
}
