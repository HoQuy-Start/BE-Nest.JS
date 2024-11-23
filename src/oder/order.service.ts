import { Injectable } from '@nestjs/common';
import { CreateOderDto } from './dto/create-oder.dto';
import { UpdateOderDto } from './dto/update-oder.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { User } from 'src/user/entities/user.entity';
import { UserAddress } from 'src/user_address/entities/user_address.entity';
import { StatusOder } from 'src/status_oder/entities/status_oder.entity';
import { OrderUpdateGateway } from 'src/order-update/order-update.gateway';
import { ConfigService } from '@nestjs/config';
import { Module, forwardRef, Inject } from '@nestjs/common';
@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(StatusOder) private readonly statusOrderRepository: Repository<StatusOder>,
    @InjectRepository(UserAddress) private readonly userAddressRepository: Repository<UserAddress>,
    @Inject(forwardRef(() => OrderUpdateGateway)) private readonly orderGetway: OrderUpdateGateway,
    private readonly configService: ConfigService
  ) { }
  async create(createOrderDto: CreateOderDto) {
    let restaurantid = createOrderDto.restaurantid
    const res = await this.userRepository.findOne({ where: [{ 'id': createOrderDto.restaurantid }] })
    const user = await this.userRepository.findOne({ where: [{ 'id': createOrderDto.userid }] })
    const user_address = await this.userAddressRepository.findOne({ where: [{ 'id': createOrderDto.userAddressid }] })
    const statusOder = await this.statusOrderRepository.findOne({ where: [{ 'id': createOrderDto.statusid }] })
    await delete createOrderDto.userid
    await delete createOrderDto.driverid
    await delete createOrderDto.restaurantid
    await delete createOrderDto.userAddressid
    await delete createOrderDto.statusid

    let dataCreate = {
      ...createOrderDto,
      restaurant: res,
      user: user,
      user_address: user_address,
      status: statusOder
    };
    const newOrder = await this.orderRepository.save(dataCreate)
    delete newOrder.user.password;
    delete newOrder.user.refresh_token;
    delete newOrder.restaurant.password;
    delete newOrder.restaurant.refresh_token;
    console.log('res', restaurantid);

    this.orderGetway.handleGetMessage(restaurantid, 'You have a new order!')
    this.orderGetway.handleGetOrder(restaurantid)
    // this.orderGetway.test()
    return newOrder
  }

  async findOrderNeedDriver(statusId: number, id?: number): Promise<Order[]> {
    const builder = (await this.queryBuiler('order'))
      .innerJoinAndSelect('order.restaurant', 'restaurant', 'order.restaurantid = restaurant.id')
      .innerJoinAndSelect('order.status', 'status_oder', 'order.statusid = status_oder.id')
      .leftJoinAndSelect('order.voucher', 'voucher', 'order.voucherid = voucher.id')
      .innerJoinAndSelect('order.user', 'user', 'order.userid = user.id')
      .innerJoinAndSelect('order.user_address', 'user_address', 'order.userAddressid = user_address.id')
      .leftJoinAndSelect('order.driver', 'driver', 'order.driverid = driver.id')
      .leftJoinAndSelect('order.order_detail', 'order_detail', 'order.id = order_detail.orderid')
      .leftJoinAndSelect('order_detail.product', 'product', 'order_detail.productId = product.id')
      .leftJoinAndSelect('restaurant.restaurant', 'res', 'restaurant.id = res.userid')
      .where('status_oder.id = :statusId', { statusId })
      .orderBy('order.created_at', 'DESC')
    id && builder.andWhere('driver.id=:id', { id })
    const addressByUser = await builder.getMany();
    console.log(addressByUser);

    addressByUser.map((item: any) => {
      return item.order_detail.map((item2: any) => item2.product.images && (item2.product.images = this.configService.get('SERVER_HOST') + '/upload/' + item2.product.images))
    })
    return addressByUser;
  }
  async findByRes(restaurantid: number): Promise<Order[]> {
    const builder = (await this.queryBuiler('order'))
      .innerJoinAndSelect('order.restaurant', 'restaurant', 'order.restaurantid = restaurant.id')
      .innerJoinAndSelect('order.status', 'status_oder', 'order.statusid = status_oder.id')
      .leftJoinAndSelect('order.voucher', 'voucher', 'order.voucherid = voucher.id')
      .innerJoinAndSelect('order.user', 'user', 'order.userid = user.id')
      .innerJoinAndSelect('order.user_address', 'user_address', 'order.userAddressid = user_address.id')
      .leftJoinAndSelect('order.driver', 'driver', 'order.driverid = driver.id')
      .leftJoinAndSelect('order.order_detail', 'order_detail', 'order.id = order_detail.orderid')
      .leftJoinAndSelect('order_detail.product', 'product', 'order_detail.productId = product.id')
      .where('restaurantid = :restaurantid', { restaurantid })
      .orderBy('order.created_at', 'DESC')
    const addressByUser = await builder.getMany();
    addressByUser.map((item: any) => {
      return item.order_detail.map((item2: any) => item2.product.images && (item2.product.images = this.configService.get('SERVER_HOST') + '/upload/' + item2.product.images))
    })
    return addressByUser;
  }
  async findByClient(userid: number): Promise<Order[]> {
    const builder = (await this.queryBuiler('order'))
      .innerJoinAndSelect('order.restaurant', 'restaurant', 'order.restaurantid = restaurant.id')
      .innerJoinAndSelect('order.status', 'status_oder', 'order.statusid = status_oder.id')
      .innerJoinAndSelect('order.user', 'user', 'order.userid = user.id')
      .innerJoinAndSelect('order.user_address', 'user_address', 'order.userAddressid = user_address.id')
      .leftJoinAndSelect('order.driver', 'driver', 'order.driverid = driver.id')
      .leftJoinAndSelect('order.order_detail', 'order_detail', 'order.id = order_detail.orderid')
      .leftJoinAndSelect('order_detail.product', 'product', 'order_detail.productId = product.id')
      .where('order.userid = :userid', { userid })
      .orderBy('order.created_at', 'DESC')
    console.log(builder.getQuery());

    const addressByUser = await builder.getMany();
    addressByUser.map((item: any) => {
      return item.order_detail.map((item2: any) => item2.product.images && (item2.product.images = this.configService.get('SERVER_HOST') + '/upload/' + item2.product.images))
    })
    return addressByUser;
  }
  async findByDriver(driverid: number): Promise<Order[]> {
    const builder = (await this.queryBuiler('order'))
      .innerJoinAndSelect('order.restaurant', 'restaurant', 'order.restaurantid = restaurant.id')
      .innerJoinAndSelect('order.status', 'status_oder', 'order.statusid = status_oder.id')
      .innerJoinAndSelect('order.user', 'user', 'order.userid = user.id')
      .innerJoinAndSelect('order.user_address', 'user_address', 'order.userAddressid = user_address.id')
      .leftJoinAndSelect('order.driver', 'driver', 'order.driverid = driver.id')
      .leftJoinAndSelect('order.order_detail', 'order_detail', 'order.id = order_detail.orderid')
      .leftJoinAndSelect('order_detail.product', 'product', 'order_detail.productId = product.id')
      .where('driverid = :driverid', { driverid })
      .orderBy('order.created_at', 'DESC')
    const addressByUser = await builder.getMany();
    return addressByUser;
  }

  async queryBuiler(alias: string) {
    return this.orderRepository.createQueryBuilder(alias)
  }

  async update(id: number, updateOrderDto: UpdateOderDto, userId?: number): Promise<any> {
    console.log('updateOrderDto', updateOrderDto);
    let statusid = updateOrderDto.statusid
    let restaurantid = updateOrderDto.restaurantid
    let clientid = updateOrderDto.clientid
    if (statusid == 4) {
      updateOrderDto.driverid = userId
    }
    console.log('updateOrderDto.driverid', updateOrderDto.driverid);

    const driver = updateOrderDto.driverid ? await this.userRepository.findOne({ where: { id: updateOrderDto.driverid } }) : null;
    console.log('driver', driver);

    const statusOrder = await this.statusOrderRepository.findOne({ where: { id: updateOrderDto.statusid } });

    delete updateOrderDto.driverid;
    delete updateOrderDto.statusid;
    delete updateOrderDto.clientid;
    delete updateOrderDto.restaurantid;
    delete updateOrderDto.userid;
    const dataUpdate = {
      ...updateOrderDto,
      driver: driver,
      status: statusOrder
    };
    // !updateOrderDto.driverid && delete dataUpdate.driver
    console.log('dataUpdate', dataUpdate);
    const update = await this.orderRepository.update(id, dataUpdate);
    if (statusid == 3) {
      this.orderGetway.handleGetOrderByDriver()
    }
    if (statusid == 2) {
      this.orderGetway.handleGetMessage(clientid, "Your order has been confirmed")
    }
    if (statusid == 5) {
      this.orderGetway.handleGetMessage(clientid, "Order has been delivery")
    }
    this.orderGetway.handleGetOrder(restaurantid)
    this.orderGetway.handleGetOrder(clientid)

    return update;
  }

  async remove(id: number) {
    return await this.orderRepository.delete(id);
  }
}
