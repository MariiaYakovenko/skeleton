import { Module } from '@nestjs/common';
import { TodoController } from './controllers/todo.controller';
import { TodoService } from './services/todo.service';
import { TodoRepository } from './repositories/todo.repository';

@Module({
  imports: [],
  controllers: [TodoController],
  providers: [TodoService, TodoRepository],
})
export class TodoModule {}
