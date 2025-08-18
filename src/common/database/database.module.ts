import { Global, Module } from '@nestjs/common';
import { Pool } from 'pg';
import { TransactionManager } from './transaction.manager';

@Global()
@Module({
  providers: [
    {
      provide: 'PG_POOL',
      useFactory: () => {
        return new Pool({
          host: process.env.DB_HOST,
          port: +process.env.DB_PORT!,
          user: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
        });
      },
    },
    TransactionManager,
  ],
  exports: ['PG_POOL', TransactionManager],
})
export class DatabaseModule {}
