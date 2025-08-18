import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { IQueryExecutor } from '../../../common/database/interfaces/query.interfaces';
import { TodoListType, CreateTodoType, TodoType, UpdateTodoType } from '../types/todo.types';
import { ITodo } from '../interfaces/todo.interfaces';
import { DELETE_TODO, FILTER_SELECT, INSERT_TODO, SELECT_BY_ID, UPDATE_TODO } from './todo.sql';

@Injectable()
export class TodoRepository {
  constructor(@Inject('PG_POOL') private readonly pool: Pool) {
  }

  async create({ userId, title }: CreateTodoType, executor: IQueryExecutor = this.pool): Promise<ITodo> {
    const { rows: [token] } = await executor.query<ITodo>(INSERT_TODO, [
      userId, title,
    ]);

    return token;
  }

  async findById({ id, userId }: TodoType, executor: IQueryExecutor = this.pool): Promise<ITodo|null> {
    const { rows: [todo] } = await executor.query<ITodo>(SELECT_BY_ID, [id, userId]);

    return todo;
  }

  async find({ userId, title, isDone, order, limit, offset }: TodoListType,
             executor: IQueryExecutor = this.pool): Promise<ITodo[]> {
    const { rows } = await executor.query<ITodo>(FILTER_SELECT,
      [userId, title, isDone, order, limit, offset ]);

    return rows;
  }

  async update({ id, userId, title, isDone }: UpdateTodoType,
               executor: IQueryExecutor = this.pool): Promise<ITodo> {
    const { rows: [todo] } = await executor.query<ITodo>(UPDATE_TODO,
      [id, userId, title, isDone]);

    return todo;
  }

  async remove({ id, userId }: TodoType, executor: IQueryExecutor = this.pool): Promise<void> {
    await executor.query<ITodo>(DELETE_TODO, [id, userId]);
  }
}