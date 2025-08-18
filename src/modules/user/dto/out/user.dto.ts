import { Expose } from 'class-transformer';

export class UserDto {
  @Expose({ name: 'id' })
  id: string;

  @Expose({ name: 'email' })
  email: string;
}