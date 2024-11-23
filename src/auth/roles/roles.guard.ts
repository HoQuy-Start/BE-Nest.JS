import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/user.service';
import { Role, User } from '../../user/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles: Role[] = this.reflector.getAllAndOverride<Role[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) return true;
    const request = context.switchToHttp().getRequest();
    const token = request.cookies?.accessToken;
    if (!token)
      throw new UnauthorizedException(
        'Thiếu mã thông báo ủy quyền',
        'Hãy login để sử dụng',
      );

    const decodedToken = this.jwtService.decode(token);
    const userId = decodedToken.sub;

    const user: User = await this.userService.getById(userId);
    const userRole: Role = user.role;

    return requiredRoles.some((role: Role) => userRole.includes(role));
  }
}
