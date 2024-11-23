import { IsNotEmpty } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty({ message: 'Vui lòng không để trống tên' })
    name: string;

    @IsNotEmpty({ message: 'Vui lòng không để trống giá' })
    price: number;

    @IsNotEmpty({ message: 'Vui lòng không để trống giá giảm giá' })
    sale_price: number;

    @IsNotEmpty({ message: 'Vui lòng không để trống trạng thái' })
    status: string;

    @IsNotEmpty({ message: 'Vui lòng không để trống thư mục' })
    categoryid: number;

    slug: string;

    description: string;

    userid: number;

    images: string;

}