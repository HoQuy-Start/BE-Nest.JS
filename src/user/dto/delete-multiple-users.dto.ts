import { ArrayMinSize, ArrayNotEmpty, IsArray, IsInt } from "class-validator";

export class DeleteMultipleDto {
  @IsArray()
  @ArrayNotEmpty({ message: "Danh sách userIds không được rỗng" })
  @ArrayMinSize(1, { message: "Cần ít nhất một userId để xóa" })
  @IsInt({ each: true, message: "Mỗi userId phải là một số nguyên" })
  userIds: number[];
}