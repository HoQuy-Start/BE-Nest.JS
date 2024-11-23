import { IsNotEmpty } from "class-validator";

export class CreateOderDto {
    @IsNotEmpty({ message: 'Vui lòng không để trống id nhà hàng' })
    restaurantid: number;

    @IsNotEmpty({ message: 'Vui lòng không để trống trạng thái' })
    statusid: number;

    @IsNotEmpty({ message: 'Vui lòng không để trống địa chỉ' })
    userAddressid: number;

    userid: number;

    note: string;

    driverid: number;
}
