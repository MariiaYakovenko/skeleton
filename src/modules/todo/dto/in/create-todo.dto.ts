import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTodoDto {
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  title: string;
}