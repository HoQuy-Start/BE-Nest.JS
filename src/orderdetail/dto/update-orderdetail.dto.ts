import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderdetailDto } from './create-orderdetail.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateOrderdetailDto extends PartialType(CreateOrderdetailDto) {
    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    quantity: number;

    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    productid: number;

    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    orderid: number;
}
