import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Tên không được rỗng' })
  @IsString({ message: 'Tên phải là một chuỗi' })
  first_name: string;

  @IsNotEmpty({ message: 'Email không được rỗng' })
  @IsEmail({}, { message: 'Email phải đúng định dạng' })
  email: string;

  @IsNotEmpty({ message: 'Password không được rỗng' })
  @Length(6, 20, { message: 'Tối thiểu 6 ký tự.' })
  password: string;

  @IsNotEmpty({ message: 'Số điện thoại không được rỗng' })
  @Matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, {
    message: 'Số điện thoại không hợp lệ',
  })
  phone_number: string;
}
