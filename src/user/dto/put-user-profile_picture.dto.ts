import { IsNotEmpty, IsString } from 'class-validator';

export class UserProfilePictureDto {
  @IsNotEmpty({ message: 'Tên không được rỗng' })
  @IsString({ message: 'Tên phải là một chuỗi' })
  profile_picture: string;
}
