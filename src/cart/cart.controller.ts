import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { async } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@UseGuards(AuthGuard('jwt'))
@Controller('api/cart')
export class CartController {
  constructor(private readonly cartService: CartService,
    private readonly configService: ConfigService) { }

  @Post()
  async create(@Body() createCartDto: CreateCartDto, @Req() req: Request & { user: any }) {
    const userid = req.user.user.id;
    createCartDto.userid = userid;
    const newCart = await this.cartService.create(createCartDto);

    return newCart
  }

  @Get()
  async getCart(@Req() req: Request & { user: any }) {
    const userid = req.user.user.id;
    const cartByUser = await this.cartService.getCart(userid);
    cartByUser.forEach((item: any) => {
      item.product.images = this.configService.get('SERVER_HOST') + '/upload/' + item.product.images
      item.product.restaurant.avatar = this.configService.get('SERVER_HOST') + '/upload/' + item.product.restaurant.avatar
    })
    return cartByUser
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateCartDto: UpdateCartDto) {
    const update = await this.cartService.update(id, updateCartDto);
    return {
      statuscode: 200,
      message: "cập nhật thành công",
      result: update
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const destroyed = await this.cartService.remove(+id);
    return {
      statuscode: 200,
      message: "xoa thành công",
      result: destroyed
    }
  }
  @Post('/deleteMany')
  async removeAll(@Body() ids: any) {
    const destroyed = await this.cartService.removeMany(ids);
    return {
      statuscode: 200,
      message: "xoa thành công",
      result: destroyed
    }
  }

}
