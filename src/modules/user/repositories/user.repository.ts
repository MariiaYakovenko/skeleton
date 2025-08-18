import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { INSERT_USER, SELECT_BY_EMAIL, UPDATE_PASSWORD_BY_EMAIL } from './user.sql';
import { IUser } from '../interfaces/user.interfaces';
import { IQueryExecutor } from '../../../common/database/interfaces/query.interfaces';
import { UserType } from '../types/user.types';

@Injectable()
export class UserRepository {
  constructor(@Inject('PG_POOL') private readonly pool: Pool) {}

  async findByEmail(email: string): Promise<IUser|null> {
    const { rows: [user] } = await this.pool.query(SELECT_BY_EMAIL, [email]);

    return user;
  }

  async create(params: UserType, executor: IQueryExecutor = this.pool): Promise<IUser> {
      const { rows: [user] } = await executor.query<IUser>(INSERT_USER, [params.email, params.passwordHash]);

      return user;

  }

  async updatePassword(params: UserType, executor: IQueryExecutor = this.pool): Promise<IUser> {
    const { rows: [user] } = await executor.query<IUser>(UPDATE_PASSWORD_BY_EMAIL, [params.email, params.passwordHash]);

    return user;

  }
}
