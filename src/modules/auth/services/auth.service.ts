import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../../user/repositories/user.repository';
import { TokenService } from './token.service';
import { TransactionManager } from '../../../common/database/transaction.manager';
import { AuthDto } from '../dto/out/tokens.dto';
import { UserDto } from '../../user/dto/out/user.dto';
import { plainToInstance } from 'class-transformer';
import { hashPassword, verifyPassword } from '../utils/hash.utils';
import { ResetPasswordDto } from '../dto/in/reset-password.dto';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository,
              private readonly tokenService: TokenService,
              private readonly transactionManager: TransactionManager,
              private readonly refreshTokenRepository: RefreshTokenRepository) {}

  async signUp(email: string, password: string): Promise<AuthDto> {
    const user = await this.userRepository.findByEmail(email);
    if (user) {
      throw new ConflictException('User already exists');
    }

    const passwordHash = await hashPassword(password);

    return this.transactionManager.run(async (executor) => {
      const newUser = await this.userRepository.create({ email, passwordHash }, executor);

      return {
        user: plainToInstance(UserDto, newUser, { excludeExtraneousValues: true }),
        session: await this.tokenService.generateTokens(newUser.id, executor),
      }
    })
  }

  async logIn(email: string, password: string): Promise<AuthDto> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!await (verifyPassword(password, user.password_hash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      user: plainToInstance(UserDto, user, { excludeExtraneousValues: true }),
      session: await this.tokenService.generateTokens(user.id),
    }
  }

  async resetPassword({ email, current_password, new_password }: ResetPasswordDto): Promise<AuthDto> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!await (verifyPassword(current_password, user.password_hash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordHash = await hashPassword(new_password);

    return this.transactionManager.run(async (executor) => {
      const updatedUser = await this.userRepository.updatePassword({ email, passwordHash }, executor);
      await this.refreshTokenRepository.revokeTokens(updatedUser.id, executor);

      return {
        user: plainToInstance(UserDto, updatedUser, { excludeExtraneousValues: true }),
        session: await this.tokenService.generateTokens(user.id, executor),
      }
    });
  }
}