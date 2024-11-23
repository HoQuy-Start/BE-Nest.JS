import { PartialType } from '@nestjs/mapped-types';
import { CreateOderDto } from './create-oder.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateOderDto extends PartialType(CreateOderDto) {

    statusid: number;
    driverid: number;
    clientid: number;
    restaurantid: number;
}
