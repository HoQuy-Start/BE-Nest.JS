import { Module } from '@nestjs/common';
import { OrderdetailService } from './orderdetail.service';
import { OrderdetailController } from './orderdetail.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDetail } from './entities/orderdetail.entity';
import { ProductModule } from 'src/product/product.module';
import { OrderModule } from 'src/oder/order.module';

@Module({
  imports: [TypeOrmModule.forFeature([OrderDetail]),
    ProductModule,
    OrderModule
  ],
  controllers: [OrderdetailController],
  providers: [OrderdetailService],
  exports: [TypeOrmModule]
})
export class OrderdetailModule { }
