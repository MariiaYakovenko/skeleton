import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { OrderEnum } from '../../../../common/enums/param.enums';

export class GetTodoListDto {
  @Transform(({ value }) => value?.trim())
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title: string;

  @Transform(({ value }) => !value ? undefined : value === 'true')
  @IsOptional()
  @IsBoolean()
  is_done: boolean;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsInt()
  @Min(0)
  offset: number = 0;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  limit: number = 20;

  @IsOptional()
  @IsEnum(OrderEnum)
  order: OrderEnum = OrderEnum.Desc;
}