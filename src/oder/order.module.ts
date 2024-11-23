import { Module, forwardRef } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { UserModule } from 'src/user/user.module';
import { StatusOderModule } from 'src/status_oder/status_oder.module';
import { RestaurantModule } from 'src/restaurant/restaurant.module';
import { ProductModule } from 'src/product/product.module';

import { UserAddressModule } from 'src/user_address/user_address.module';
import { OrderUpdateModule } from 'src/order-update/order-update.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    forwardRef(() => UserModule),
    // forwardRef(() => OrderUpdateModule),
    OrderUpdateModule,
    // OrderModule,
    RestaurantModule,
    StatusOderModule,
    UserAddressModule,
    // AuthModule
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [TypeOrmModule, OrderService]
})
export class OrderModule { }
