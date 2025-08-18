import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { TodoService } from '../services/todo.service';
import { RequiresAuth } from '../../../common/decorators/requires-auth.decorator';
import { CreateTodoDto } from '../dto/in/create-todo.dto';
import { TodoDto } from '../dto/out/todo.dto';
import { GetTodoListDto } from '../dto/in/get-todo-list.dto';
import { UpdateTodoDto } from '../dto/in/update-todo.dto';

@RequiresAuth()
@Controller('todo')
export class TodoController {
  constructor(private readonly service: TodoService) {
  }

  @Post()
  async create(@Body() dto: CreateTodoDto): Promise<TodoDto> {
    return this.service.create(dto.title);
  }

  @Get(':id')
  async getOne(@Param('id', ParseUUIDPipe) id: string): Promise<TodoDto> {
    return this.service.getOne(id);
  }

  @Get()
  async list(@Query() params: GetTodoListDto): Promise<TodoDto[]> {
    return this.service.list(params);
  }

  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateTodoDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.service.remove(id);
  }
}