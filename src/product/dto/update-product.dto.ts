import { PartialType } from "@nestjs/mapped-types";
import { CreateProductDto } from "./create-product.dto";

export class UpdateProductDto extends PartialType(CreateProductDto) {

    name: string;


    price: number;

    sale_price: number;

    status: string;

    slug: string;

    description: string;

    userid: number;

    categoryid: number;

    images: string;

}
