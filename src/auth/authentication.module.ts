import { Module } from "@nestjs/common";
import { AuthenticationController } from "./authentication.controller";
import { AuthenticationService } from "./authentication.service";
import { UserModule } from "../user/user.module";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { LocalStrategy } from "./local/local.strategy";
import { JwtStrategy } from "./jwt/jwt.strategy";
import { JwtRefreshTokenStrategy } from "./jwt/jwt-refresh-token";
import { MailerService } from "./email/mail";
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesService } from "src/categories/categories.service";

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.JWT_SECRET
      }),
      global: true
    }),
    TypeOrmModule.forFeature([CategoriesService]), UserModule,
  ],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshTokenStrategy,
    MailerService
  ]
})
export class AuthenticationModule {
}
