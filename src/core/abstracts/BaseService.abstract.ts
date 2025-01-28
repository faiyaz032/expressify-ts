import { DocumentType } from '@typegoose/typegoose';
import { logger } from '@typegoose/typegoose/lib/logSettings';
import { StatusCodes } from 'http-status-codes';
import { FilterQuery } from 'mongoose';
import CustomError from '../../shared/error-handling/CustomError';
import { ObjectIdType } from '../../shared/schemas/objectId.schema';
import { PaginatedResult } from '../types/common.types';
import { BaseRepository } from './BaseRepository.abstract';

export default abstract class BaseService<T, CreateTypeDto> {
  /**
   * @param repository - The repository instance to be used by the service.
   */
  constructor(protected readonly repository: BaseRepository<T, CreateTypeDto>) {}

  /**
   * @param data - The data to be created.
   * @returns The created document.
   */
  async create(data: CreateTypeDto): Promise<DocumentType<T>> {
    try {
      return this.repository.create(data);
    } catch (error: any) {
      logger.error(`Failed to create document: ${error}`, { error });
      throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to create document. Please try again later.');
    }
  }

  async getAll(query: FilterQuery<T> = {}): Promise<PaginatedResult<DocumentType<T>>> {
    try {
      return this.repository.findAll(query);
    } catch (error: any) {
      logger.error(`Failed to get all documents: ${error}`, { error });
      throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to get all documents. Please try again later.');
    }
  }

  async getOne(query: FilterQuery<T>): Promise<DocumentType<T> | null> {
    try {
      return this.repository.findOne(query);
    } catch (error: any) {
      logger.error(`Failed to get one document: ${error}`, { error });
      throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to get one document. Please try again later.');
    }
  }

  async getOneById(id: ObjectIdType): Promise<DocumentType<T> | null> {
    try {
      return this.repository.findById(id);
    } catch (error: any) {
      logger.error(`Failed to get one document by id: ${error}`, { error });
      throw new CustomError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to get one document by id. Please try again later.'
      );
    }
  }

  async updateById(id: ObjectIdType, data: Partial<DocumentType<T>>): Promise<DocumentType<T> | null> {
    return this.repository.updateById(id, data);
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
