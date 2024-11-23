import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { UserModule } from "src/user/user.module";
import { CategoriesModule } from "src/categories/categories.module";

@Module({
  imports: [TypeOrmModule.forFeature([Product]),
    UserModule,
    CategoriesModule,
  ],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [TypeOrmModule]
})
export class ProductModule {
}