import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';

@Injectable()
export class TransactionManager {
  constructor(@Inject('PG_POOL') private readonly pool: Pool) {}

  async run<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await fn(client);
      await client.query('COMMIT');

      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('error', error.message);
      throw new ConflictException('DB Error, transaction rollback');
    } finally {
      client.release();
    }
  }
}
