import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCategoryDto {
  @IsNotEmpty({ message: "Category not found" })
  @IsString({ message: "Category name must be a string" })
  categoryName: string;

  @IsNumber()
  @IsOptional()
  parent?: number;

}