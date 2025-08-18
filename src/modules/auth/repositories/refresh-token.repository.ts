import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { IQueryExecutor } from '../../../common/database/interfaces/query.interfaces';
import { INSERT_REFRESH_TOKEN, REVOKE_REFRESH_TOKENS } from './refresh-token.sql';
import { IRefreshToken } from '../interfaces/refresh-token.interfaces';
import { RefreshTokenType } from '../types/token.types';

@Injectable()
export class RefreshTokenRepository {
  constructor(@Inject('PG_POOL') private readonly pool: Pool) {
  }

  async create(params: RefreshTokenType, executor: IQueryExecutor = this.pool): Promise<IRefreshToken> {
    const { rows: [token] } = await executor.query<IRefreshToken>(INSERT_REFRESH_TOKEN, [
      params.userId, params.secretHash, params.expiresAt,
    ]);

    return token;
  }

  async revokeTokens(userId: string, executor: IQueryExecutor = this.pool): Promise<void> {
    await executor.query(REVOKE_REFRESH_TOKENS, [userId]);
  }
}