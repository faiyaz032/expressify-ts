import { BaseRepository } from '@lib/core/abstracts/BaseRepository.abstract';
import { PaginatedResult } from '@lib/core/types/common.types';
import CustomError from '@shared/error-handling/CustomError';
import { ObjectIdType } from '@shared/schemas/objectId.schema';
import { loggerToken } from '@shared/tokens';
import { DocumentType } from '@typegoose/typegoose';
import { logger } from '@typegoose/typegoose/lib/logSettings';
import { StatusCodes } from 'http-status-codes';
import { FilterQuery } from 'mongoose';
import { resolve } from 'registry';
import { Logger } from 'winston';

export default abstract class BaseService<T> {
  protected readonly logger: Logger;
  constructor(protected readonly repository: BaseRepository<T>) {
    this.logger = resolve<Logger>(loggerToken);
  }

  async create(data: Omit<T, '_id'>): Promise<DocumentType<T>> {
    try {
      return this.repository.create(data);
    } catch (error: any) {
      this.logger.error(`Failed to create document: ${error}`, { error });
      throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to create document. Please try again later.');
    }
  }

  async getAll(query: FilterQuery<T> = {}): Promise<PaginatedResult<DocumentType<T>>> {
    try {
      return this.repository.findAll(query);
    } catch (error: any) {
      this.logger.error(`Failed to get all documents: ${error}`, { error });
      throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to get all documents. Please try again later.');
    }
  }

  async getOne(query: FilterQuery<T>): Promise<DocumentType<T> | null> {
    try {
      return this.repository.findOne(query);
    } catch (error: any) {
      this.logger.error(`Failed to get one document: ${error}`, { error });
      throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to get one document. Please try again later.');
    }
  }

  async getOneById(id: ObjectIdType): Promise<DocumentType<T> | null> {
    try {
      return this.repository.findById(id);
    } catch (error: any) {
      this.logger.error(`Failed to get one document by id: ${error}`, { error });
      throw new CustomError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to get one document by id. Please try again later.'
      );
    }
  }

  async updateById(id: ObjectIdType, data: Partial<DocumentType<T>>): Promise<DocumentType<T> | null> {
    try {
      return this.repository.updateById(id, data);
    } catch (error: any) {
      this.logger.error(`Failed to update document by id: ${error}`, { error });
      throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to update document. Please try again later.');
    }
  }

  async deleteById(id: ObjectIdType): Promise<DocumentType<T> | null> {
    try {
      return this.repository.deleteById(id);
    } catch (error: any) {
      logger.error(`Failed to delete document by id: ${error}`, { error });
      throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to delete document. Please try again later.');
    }
  }
}
