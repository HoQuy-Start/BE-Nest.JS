import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { OrderdetailService } from './orderdetail.service';
import { CreateOrderdetailDto } from './dto/create-orderdetail.dto';
import { UpdateOrderdetailDto } from './dto/update-orderdetail.dto';

@Controller('api/orderdetail')
export class OrderdetailController {
  constructor(private readonly orderdetailService: OrderdetailService) { }

  @Post()
  create(@Body() createOrderdetailDto: CreateOrderdetailDto) {
    return this.orderdetailService.create(createOrderdetailDto);
  }



  @Put(':id')
  async update(@Param('id') id: number, @Body() updateOrderDetailDto: UpdateOrderdetailDto) {
    const update = await this.orderdetailService.update(id, updateOrderDetailDto)
    return {
      statuscode: 200,
      message: "cập nhật thành công",
      result: update
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderdetailService.remove(+id);
  }
}
