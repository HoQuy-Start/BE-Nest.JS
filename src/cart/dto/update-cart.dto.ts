import { PartialType } from '@nestjs/mapped-types';
import { CreateCartDto } from './create-cart.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateCartDto extends PartialType(CreateCartDto) {

    quantity: number

}
