import { IsNotEmpty } from "class-validator";

export class CreateCartDto {

    @IsNotEmpty()
    quantity: number

    @IsNotEmpty()
    productid: number

    userid: number

}
