/* eslint-disable prettier/prettier */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService
        .verifyAsync(token, {
          secret: jwtConstants.secret,
        })
        .catch(() => {
          throw new UnauthorizedException();
        });

      // Assign user to Http request that hits to controller/routers
      request['user'] = payload;
    } catch (err) {
      throw new UnauthorizedException();
    }
    return true;
  }
  extractTokenFromHeader(request: Request): string | undefined {
    if (!request.headers.authorization) {
      return null;
    }
    // const [type, token] = request.headers.authorization?.split(' ') ?? [];
    // return type === 'Bearer' ? token : undefined;

    // Without 'Bearer ' prefix
    const token = request.headers.authorization;
    return token;
  }
}
