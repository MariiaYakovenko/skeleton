import { Injectable } from '@nestjs/common';
import { signJWT } from '../utils/jwt.utils';
import { generateSecret, hashSecret } from '../utils/hash.utils';
import { PoolClient } from 'pg';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository';
import { TokensDto } from '../dto/out/tokens.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService {
  constructor(private readonly refreshTokenRepository: RefreshTokenRepository,
              private readonly config: ConfigService) {}

  async generateTokens(userId: string, executor?: PoolClient): Promise<TokensDto> {
    const secret = generateSecret();
    const secretHash = hashSecret(secret);
    const refreshToken = await this.refreshTokenRepository.create({
      userId,
      expiresAt: new Date(Date.now() + Number(this.config.getOrThrow('REFRESH_TTL_MS'))),
      secretHash
    }, executor);

    return {
      access_token: signJWT({
        userId,
        secret: Buffer.from(this.config.getOrThrow<string>('JWT_ACCESS_SECRET'), 'base64'),
        expiresIn: +this.config.getOrThrow('ACCESS_TTL_SEC'),
      }),
      expires_in: +this.config.getOrThrow('ACCESS_TTL_SEC'),
      refresh_token: `${refreshToken.id}.${secret}`,
    }
  }
}