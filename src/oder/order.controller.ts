import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Req, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOderDto } from './dto/create-oder.dto';
import { UpdateOderDto } from './dto/update-oder.dto';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { Order } from './entities/order.entity';

@UseGuards(AuthGuard('jwt'))
@Controller('api/order')
export class OrderController {
  constructor(private readonly oderService: OrderService) { }

  @Post()
  async create(
    @Req() req: Request & { user: any },
    @Body() createOderDto: CreateOderDto) {
    createOderDto.userid = req.user.user.id
    console.log(createOderDto);
    const res = await this.oderService.create(createOderDto);
    return {
      statuscode: 200,
      message: "thêm mới thành công",
      result: res
    }
  }
  @Get('/getDetailOrderFindDriver')
  async getDetailOrderFindDriver(@Param() id: number, @Req() req: Request & { user: any }): Promise<Order[]> {
    const userid = req.user.user.id;
    const addressByUser = await this.oderService.findOrderNeedDriver(4, userid);
    return addressByUser;
  }
  @Get('/getOrderFindDriver')
  async getOrderFindDriver(@Req() req: Request & { user: any }): Promise<Order[]> {
    const userid = req.user.user.id;
    const addressByUser = await this.oderService.findOrderNeedDriver(3);
    return addressByUser;
  }
  @Get('/getByRestaurant')
  async getByRestaurant(@Req() req: Request & { user: any }): Promise<Order[]> {
    const userid = req.user.user.id;
    const addressByUser = await this.oderService.findByRes(userid);
    return addressByUser;
  }
  @Get('/getByDriver')
  async getByDriver(@Req() req: Request & { user: any }): Promise<Order[]> {
    const userid = req.user.user.id;
    const addressByUser = await this.oderService.findByDriver(userid);
    return addressByUser;
  }
  @Get('/getByClient')
  async getByClient(@Req() req: Request & { user: any }): Promise<Order[]> {
    const userid = req.user.user.id;
    const addressByUser = await this.oderService.findByClient(userid);
    return addressByUser;
  }
  @Put(':id')
  async update(@Param('id') id: number, @Req() req: Request & { user: any }, @Body() updateOrderDto: UpdateOderDto) {
    console.log(updateOrderDto);

    const update = await this.oderService.update(id, updateOrderDto, req.user.user.id)
    return {
      statuscode: 200,
      message: "cập nhật thành công",
      result: update
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.oderService.remove(+id);
  }
}
