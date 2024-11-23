import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { User } from "../user/entities/user.entity";
import { UserService } from "../user/user.service";
import { MysqlErrorCode } from "../result_errors_enums/mysql-error-code.enum";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { nanoid } from "nanoid";
import { MailerService } from "./email/mail";
import { ResetPasswordDto } from "../user/dto/reset-password.dto";


@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService
  ) {
  }

  public async registerUser(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword: string = await bcrypt.hash(createUserDto.password, 10);
    try {
      const createdUser: User = await this.userService.createUser({
        ...createUserDto,
        password: hashedPassword
      });
      createdUser.password = undefined;
      return createdUser;
    } catch (error) {
      if (error?.code === MysqlErrorCode.UniqueViolation) {
        throw new HttpException("Email đã tồn tại", HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        "Đã xảy ra lỗi",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  public async getAuthenticatedUser(email: string, hashedPassword: string): Promise<User> {
    try {
      const user: User = await this.userService.getByEmail(email);
      await this.verifyPassword(hashedPassword, user.password);
      user.password = undefined;
      return user;
    } catch (error) {
      if (error.getStatus() === HttpStatus.NOT_FOUND) {
        throw new HttpException("Thông tin tài khoản hoặc mật khẩu không chính xác", HttpStatus.NOT_FOUND);
      } else if (error.getStatus() === HttpStatus.NOT_FOUND) {
        throw new HttpException("Thông tin tài khoản hoặc mật khẩu không chính xác", HttpStatus.NOT_FOUND);
      }
      throw new HttpException("Đã xảy ra lỗi", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async verifyPassword(plainTextPassword: string, hashedPassword: string): Promise<void> {
    const isPasswordMatching: boolean = await bcrypt.compare(plainTextPassword, hashedPassword);
    if (!isPasswordMatching) {
      throw new HttpException("Mật khẩu không khớp", HttpStatus.NOT_FOUND);
    }
  }

  public async generateJwtToken(user: User) {
    const payload: { sub: number } = { sub: user.userId };
    return this.jwtService.sign(payload, { expiresIn: "10s" });
  }

  public async generateRefreshToken(user: User): Promise<string> {
    const payload: { sub: number } = { sub: user.userId };
    return this.jwtService.sign(payload, { expiresIn: "7d" });
  }

  public async forgotPassword(email: string): Promise<any> {
    const user: User = await this.userService.getByEmail(email);
    if (user) {
      const expiryDate: Date = new Date();
      expiryDate.setMinutes(expiryDate.getMinutes() + 30);
      const resetToken: string = nanoid(64);
      await this.userService.updateResetTokenUser(user.userId, resetToken, expiryDate);
      await this.mailerService.sendMail(email, resetToken);
    } else {
      return { msg: "Nếu người dùng tồn tại bạn xẽ nhận được Email" };
    }
    return { msg: "Nếu người dùng tồn tại bạn xẽ nhận được Email" };
  }

  public async updateUserPassword(userId: number, newPassword: string): Promise<any> {
    const hashedPassword: string = await bcrypt.hash(newPassword, 10);
    return await this.userService.updateUserPassword(userId, hashedPassword);
  }

  public async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<any> {
    const user: User = await this.userService.findToken(resetPasswordDto.reset_token);
    if (!user) throw new HttpException("Token không hợp lệ", HttpStatus.NOT_FOUND);
    if (new Date() > user.expiryDate) throw new HttpException("Mã thông báo hết hạn", HttpStatus.NOT_FOUND);

    await this.updateUserPassword(user.userId, resetPasswordDto.newPassword);
    await this.userService.updateResetTokenUser(user.userId, null, null);
  };

}
