import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { TokenService } from 'src/modules/auth/token.service';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService, private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const token = req.cookies?.['otp'] ?? req.headers['authorization']?.toString().replace(/^Bearer\s+/i, '');
    if (!token) throw new UnauthorizedException('Authentication required');

    const payload = this.tokenService.verifyAccessToken(token);
    if (!payload?.userId) throw new UnauthorizedException('Invalid token');

    const user = await this.userService.findById(payload.userId);
    if (!user) throw new UnauthorizedException('User not found');

    (req as any).user = { id: user.id, role: user.role, username: user.username };
    return true;
  }
}