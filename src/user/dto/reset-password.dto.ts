import { IsNotEmpty, IsString, Length } from "class-validator";

export class ResetPasswordDto {
  @IsString()
  reset_token: string;

  @IsString()
  @IsNotEmpty({ message: 'Password không được rỗng' })
  @Length(6, 20, { message: 'Tối thiểu 6 ký tự.' })
  newPassword: string;


}