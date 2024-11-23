import { Injectable } from '@nestjs/common';
import { CreateOrderdetailDto } from './dto/create-orderdetail.dto';
import { UpdateOrderdetailDto } from './dto/update-orderdetail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDetail } from './entities/orderdetail.entity';
import { Repository } from 'typeorm';
import { Product } from 'src/product/entities/product.entity';
import { Order } from 'src/oder/entities/order.entity';

@Injectable()
export class OrderdetailService {

  constructor(
    @InjectRepository(OrderDetail) private readonly orderDetailRepository: Repository<OrderDetail>,
    @InjectRepository(Product) private readonly proRepository: Repository<Product>,
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,

  ) { }

  async create(createOderDetailDto: CreateOrderdetailDto) {
    const product = await this.proRepository.findOne({ where: [{ 'id': createOderDetailDto.productid }] })
    const oder = await this.orderRepository.findOne({ where: [{ 'id': createOderDetailDto.orderid }] })
    await delete createOderDetailDto.productid
    await delete createOderDetailDto.orderid
    let dataCreate = {
      ...createOderDetailDto,
      product: product,
      order: oder
    };
    return await this.orderDetailRepository.save(dataCreate)
  }

  async update(id: number, updateOrderDetailDto: UpdateOrderdetailDto): Promise<any> {
    const product = await this.proRepository.findOne({ where: [{ 'id': updateOrderDetailDto.productid }] })
    const order = await this.orderRepository.findOne({ where: [{ 'id': updateOrderDetailDto.orderid }] })
    await delete updateOrderDetailDto.productid
    await delete updateOrderDetailDto.orderid


    let dataUpdate = {
      id: id,
      ...updateOrderDetailDto,
      product: product,
      order: order,
    };
    return await this.orderDetailRepository.update(id, dataUpdate)

    //  this.proRepository.update(id, newPro);
  }

  async remove(id: number) {

   return
  }
  

}
