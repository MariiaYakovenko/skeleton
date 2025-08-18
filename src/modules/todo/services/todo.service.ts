import { Injectable, NotFoundException } from '@nestjs/common';
import { TodoRepository } from '../repositories/todo.repository';
import { TodoDto } from '../dto/out/todo.dto';
import { ClsService } from 'nestjs-cls';
import { GetTodoListDto } from '../dto/in/get-todo-list.dto';
import { UpdateTodoDto } from '../dto/in/update-todo.dto';

@Injectable()
export class TodoService {
  constructor(private readonly repository: TodoRepository,
              private readonly ctx: ClsService) {}

  async create(title: string): Promise<TodoDto> {
    return this.repository.create({ userId: this.ctx.get('userId'), title })
  }

  async getOne(id: string): Promise<TodoDto> {
    const todo = await this.repository.findById({ id, userId: this.ctx.get('userId') });
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    return todo;
  }

  async list(params: GetTodoListDto): Promise<TodoDto[]> {
    return this.repository.find({
      userId: this.ctx.get('userId'),
      title: params.title,
      isDone: params.is_done,
      order: params.order,
      limit: params.limit,
      offset: params.offset,
    })
  }

  async update(id: string, params: UpdateTodoDto): Promise<TodoDto> {
    const todo = await this.repository.findById({ id, userId: this.ctx.get('userId') });
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    return this.repository.update({
      id,
      userId: this.ctx.get('userId'),
      title: params.title,
      isDone: params.is_done,
    });
  }

  async remove(id: string): Promise<void> {
    const todo = await this.repository.findById({ id, userId: this.ctx.get('userId') });
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    await this.repository.remove({ id, userId: this.ctx.get('userId') });
  }
}