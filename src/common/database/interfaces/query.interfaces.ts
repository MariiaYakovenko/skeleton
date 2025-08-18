import type { QueryResult, QueryResultRow } from 'pg';

export interface IQueryExecutor {
  query: <T extends QueryResultRow>(text: string, params?: any[]) => Promise<QueryResult<T>>;
}
