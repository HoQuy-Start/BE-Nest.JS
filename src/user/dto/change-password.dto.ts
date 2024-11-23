import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty({ message: 'Password không được rỗng' })
  @Length(6, 20, { message: 'Tối thiểu 6 ký tự.' })
  @IsString()
  oldPassword: string;

  @IsNotEmpty({ message: 'Password không được rỗng' })
  @Length(6, 20, { message: 'Tối thiểu 6 ký tự.' })
  @IsString()
  newPassword: string;
}
