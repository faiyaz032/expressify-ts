import { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import { AnyParamConstructor, BeAnObject } from '@typegoose/typegoose/lib/types';
import { StatusCodes } from 'http-status-codes';
import { FilterQuery } from 'mongoose';
import CustomError from '../../shared/error-handling/CustomError';
import logger from '../../shared/logger/LoggerManager';
import { ObjectIdType } from '../../shared/schemas/objectId.schema';
import { calculatePagination } from '../../shared/utils/calculatePagination';
import { PaginatedResult } from '../types/common.types';

export abstract class BaseRepository<T> {
  protected constructor(protected readonly model: ReturnModelType<AnyParamConstructor<T>, BeAnObject>) {}

  async create(data: Partial<T>): Promise<DocumentType<T>> {
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
      return (await this.model.findById(id).lean().exec()) as DocumentType<T> | null;
    } catch (error: any) {
      logger.error(`Failed to find document by id: ${error.message}`, { error });
      throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to find document. Please try again later.');
    }
  }

  async findOne(query: FilterQuery<T>): Promise<DocumentType<T> | null> {
    try {
      return (await this.model.findOne(query).lean().exec()) as DocumentType<T> | null;
    } catch (error: any) {
      logger.error(`Failed to find document: ${error.message}`, { error });
      throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to find document. Please try again later.');
    }
  }

  async updateById(id: ObjectIdType, data: Partial<T>): Promise<DocumentType<T> | null> {
    try {
      return (await this.model.findByIdAndUpdate(id, data, { new: true }).lean().exec()) as DocumentType<T> | null;
    } catch (error: any) {
      logger.error(`Failed to update document by id: ${error.message}`, { error });
      throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to update document. Please try again later.');
    }
  }

  async deleteById(id: ObjectIdType): Promise<DocumentType<T> | null> {
    try {
      return (await this.model.findByIdAndDelete(id).lean().exec()) as DocumentType<T> | null;
    } catch (error: any) {
      logger.error(`Failed to delete document by id: ${error.message}`, { error });
      throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to delete document. Please try again later.');
    }
  }

  async findAll(query: FilterQuery<T> = {}): Promise<PaginatedResult<T>> {
    try {
      const { page, limit, search, searchFields, selectFields, populateFields, ...cleanQuery } = query;
      const pageNum = Number(page) || 1;
      const limitNum = Number(limit) || 10;

      let finalQuery: FilterQuery<T> = { ...cleanQuery } as FilterQuery<T>;

      if (search && searchFields?.length) {
        const searchConditions = searchFields.map((field: string) => ({
          [field]: { $regex: search, $options: 'i' },
        }));

        finalQuery = {
          $and: [cleanQuery as FilterQuery<T>, { $or: searchConditions } as FilterQuery<T>],
        } as FilterQuery<T>;
      }

      const queryBuilder = this.model
        .find(finalQuery)
        .sort({ createdAt: 'desc' })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean();

      if (selectFields?.length) {
        queryBuilder.select(selectFields.join(' '));
      }

      if (populateFields?.length) {
        populateFields.forEach((field: string) => queryBuilder.populate(field).lean());
      }

      const [data, total] = await Promise.all([queryBuilder.exec(), this.model.countDocuments(finalQuery)]);

      return {
        data: data as DocumentType<T>[],
        pagination: calculatePagination({ page: pageNum, limit: limitNum, total }),
      };
    } catch (error: any) {
      logger.error(`Failed to find documents: ${error.message}`, { error });
      throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to find documents. Please try again later.');
    }
  }
}
