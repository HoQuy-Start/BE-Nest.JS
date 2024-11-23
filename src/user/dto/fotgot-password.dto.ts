import { IsEmail, IsNotEmpty } from "class-validator";

export class FotgotPasswordDto {
  @IsNotEmpty({ message: "Email không được rỗng" })
  @IsEmail({}, { message: "Email không hợp lệ" })
  email: string;
}
