import { OrderEnum } from '../../../common/enums/param.enums';

export type CreateTodoType = {
  userId: string;
  title: string;
}

export type TodoListType = CreateTodoType & {
  isDone: boolean;
  offset: number;
  limit: number;
  order: OrderEnum;
}

export type TodoType = {
  id: string;
  userId: string;
}

export type UpdateTodoType = TodoType & {
  title?: string;
  isDone?: boolean;
}