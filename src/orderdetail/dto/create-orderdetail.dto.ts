import { IsNotEmpty } from "class-validator";

export class CreateOrderdetailDto {
    @IsNotEmpty({ message: 'Vui lòng không để trống quantity' })
    quantity: number;

    @IsNotEmpty({ message: 'Vui lòng không để trống productid' })
    productid: number;

    @IsNotEmpty({ message: 'Vui lòng không để trống orderid' })
    orderid: number;
}
