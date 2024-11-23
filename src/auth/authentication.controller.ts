import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { Role, User } from "../user/entities/user.entity";
import { AuthenticationService } from "./authentication.service";
import RequestWithUser from "./request-with-user.interface";
import { JwtAuthGuard } from "./jwt/jwt-auth.guard";
import { UserService } from "../user/user.service";
import { LocalAuthGuard } from "./local/local-auth.guard";
import JwtRefreshGuard from "./jwt/jwt-refresh.guard";
import e, { Request, Response } from "express";
import { Roles } from "./roles/roles.decorator";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { UserProfilePictureDto } from "../user/dto/put-user-profile_picture.dto";
import { EditUserProfile } from "../user/dto/put-user-profile.dto";
import { ChangePasswordDto } from "../user/dto/change-password.dto";
import { FotgotPasswordDto } from "../user/dto/fotgot-password.dto";
import { ResetPasswordDto } from "../user/dto/reset-password.dto";
import { DeleteMultipleDto } from "../user/dto/delete-multiple-users.dto";

@Controller("auth")
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly userService: UserService
  ) {
  }

  @Post("register")
  @HttpCode(200)
  public async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.authenticationService.registerUser(createUserDto);
  }
  
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post("log-in")
  public async logIn(@Req() request: RequestWithUser, @Res({ passthrough: true }) res: Response): Promise<any> {
    const accessTokenCookie: string = await this.authenticationService.generateJwtToken(request.user);
    const refreshTokenCookie: string = await this.authenticationService.generateRefreshToken(request.user);
    await this.userService.setCurrentRefreshToken(refreshTokenCookie, Number(request.user.userId));
    res.cookie("accessToken", accessTokenCookie, {
      httpOnly: true,
      sameSite: "none",
      secure: true
    });
    res.cookie("refreshToken", refreshTokenCookie, {
      httpOnly: true,
      sameSite: "none",
      secure: true
    });
    return { user: request.user };
  }

  @UseGuards(JwtAuthGuard)
  @Post("log-out")
  @HttpCode(200)
  public async logOut(@Req() request: RequestWithUser, @Res({ passthrough: true }) res: Response): Promise<any> {
    try {
      await this.userService.removeRefreshToken(request.user.userId);
      await this.userService.setUserActiveStatus(request.user.userId, false);
      res.clearCookie("refreshToken");
      res.clearCookie("accessToken");
      return { message: "Đăng xuất thành công" };
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
      return { message: "Đã xảy ra lỗi khi đăng xuất" };
    }
  }

  @UseGuards(JwtRefreshGuard)
  @Get("refresh")
  public async refresh(@Req() request: RequestWithUser, @Res({ passthrough: true }) res: Response): Promise<any> {
    try {
      const accessTokenCookie: string = await this.authenticationService.generateJwtToken(request.user);
      res.cookie("accessToken", accessTokenCookie, {
        httpOnly: true,
        sameSite: "none",
        secure: true
      });
      return { message: "Update thành công RefreshToken" };
    } catch (error) {
      return { message: "Đã xảy ra lỗi khi làm mới token" };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put("upload-picture/:userId")
  @HttpCode(200)
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./uploads",
        filename: (req: e.Request, file: Express.Multer.File, callback
        ): void => {
          const name: string = file.originalname.split(".")[0];
          const fileExtension: string = file.originalname.split(".")[1];
          const newFileName: string = name.split(" ").join("_") + "_" + Date.now() + "." + fileExtension;
          callback(null, newFileName);
        }
      }),
      fileFilter: (req: any, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void
      ): void => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return callback(new Error("Chỉ cho phép các tệp hình ảnh!"), false);
        }
        callback(null, true);
      }
    })
  )
  public async updatePicture(@Req() req: Request, @Param("userId") userId: number, @UploadedFile() file: Express.Multer.File): Promise<any> {
    if (!file) {
      return { message: "Tệp tin không phải là hình ảnh" };
    } else {
      const filePath: string = `http://${req.get("host")}/uploads/${file.filename}`;
      const userProfilePictureDto: UserProfilePictureDto = new UserProfilePictureDto();
      userProfilePictureDto.profile_picture = filePath;
      const updateResult = await this.userService.updateUserprofile_pictureOne(userId, userProfilePictureDto);
      return {
        message: "Upload successful!",
        filePath: filePath,
        updateResult: updateResult
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put("edit-profile/:userId")
  @HttpCode(200)
  public async editProfile(@Param("userId") userId: number, @Body() editUserProfile: EditUserProfile): Promise<User> {
    return await this.userService.updateUserName_gender_phone(userId, editUserProfile);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  @Delete("admin/deleteUser/:userId")
  @HttpCode(200)
  public async adminDeleteUser(@Param("userId") userId: number): Promise<any> {
    const user: User = await this.userService.getById(userId);
    if (user.role === Role.Admin)
      throw new HttpException("Khong duoc phep xoa Admin", HttpStatus.NOT_FOUND);
    await this.userService.deleteUser(userId);
    return { msg: "Admin deleted user successfully" };
  }

  // cần bổ sung thêm. nếu xóa người dùng xẽ xóa mọi thứ liên quan đến nó
  @UseGuards(JwtAuthGuard)
  @Delete("deleteUser")
  public async delete(@Req() request: RequestWithUser): Promise<any> {
    const user: User = await this.userService.getById(request.user.userId);
    if (user.role === Role.Admin) throw new HttpException("Khong duoc phep xoa Admin", HttpStatus.NOT_FOUND);
    await this.userService.deleteUser(request.user.userId);
    return { msg: "succeed successfully" };
  }

  @UseGuards(JwtAuthGuard)
  @Put("changePassword-user")
  @HttpCode(200)
  public async changePassword(@Req() request: RequestWithUser, @Body() changePasswordDto: ChangePasswordDto): Promise<any> {
    const userId: number = request.user.userId;
    try {
      await this.userService.changePassword(userId, changePasswordDto);
      return { message: "Password changed successfully!" };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @Post("forgot-password")
  @HttpCode(200)
  public async forgotPassword(@Body() fotgotPasswordDto: FotgotPasswordDto): Promise<any> {
    await this.authenticationService.forgotPassword(fotgotPasswordDto.email);
  }

  @Put("reset-password")
  public async reserPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<any> {
    await this.authenticationService.resetPassword(resetPasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  @Delete("delete-users-multiple")
  @HttpCode(200)
  public async deleteUsers(@Body() deleteUsersDto: DeleteMultipleDto): Promise<void> {
    await this.userService.deleteUsersByIds(deleteUsersDto.userIds);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  @Get("finByName")
  public async findByUsername(@Query("name") name?: string): Promise<User> {
    return await this.userService.findByName(name);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  @Get("APIFeatures")
  async getUsers(@Query() query: string[]): Promise<any> {
    const users: User[] = await this.userService.getUsers(query);
    return {
      message: "success",
      data: users
    };
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  @Get("getAll")
  public async getAll(@Query() query: any): Promise<User[]> {
    return await this.userService.getAll(query);

  }

  @Get("active-users")
  async getActiveUsers(): Promise<any> {
    const activeUsers: User[] = await this.userService.getActiveUsers();
    return {
      message: "success",
      data: activeUsers
    };
  }
}
