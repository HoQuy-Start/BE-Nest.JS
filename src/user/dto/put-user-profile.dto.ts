import { IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator';

export class EditUserProfile {
  @IsNotEmpty({ message: 'Tên không được rỗng' })
  @IsString({ message: 'Tên phải là một chuỗi' })
  first_name: string;

  @IsNotEmpty({ message: 'Số điện thoại không được rỗng' })
  @Matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, {
    message: 'Số điện thoại không hợp lệ',
  })
  phone_number: string;

  @IsEnum(['male', 'female', 'other'], { message: 'Giới tính không hợp lệ' })
  gender: string;
}
