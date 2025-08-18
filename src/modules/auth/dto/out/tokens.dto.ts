import { UserDto } from '../../../user/dto/out/user.dto';

export class TokensDto {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
}

export class AuthDto {
  user: UserDto;
  session: TokensDto;
}