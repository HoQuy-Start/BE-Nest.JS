import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Categories } from "../../categories/entities/categories.entity";
import { Brand } from "../../brand/entities/brand.entity";

@Entity("product")
export class Product {
  @PrimaryGeneratedColumn()
  productId: number;

  // nay xe rend tu dong
  @Column()
  product_sku: string;

  @Column()
  productName: string;

  @Column()
  productDescription: string;

  //giá bán lẻ
  @Column()
  product_retail_price: number;

  // giá nhập
  @Column()
  product_purchase_price: number;

  // giá đã giảm 10%
  @Column()
  productDiscountPrice: number;

  @Column()
  productImage: string;

  //Số lượng sản phẩm trong kho
  @Column()
  productQuantity: number;

  //Dấu thời gian khi bản ghi sản phẩm được tạo
  @CreateDateColumn({ type: "timestamp" })
  productCreatedAt: Date;

  //Dấu thời gian khi bản ghi sản phẩm được cập nhật lần cuối
  @UpdateDateColumn({ type: "timestamp" })
  productUpdatedAt: Date;

  @ManyToOne(() => Categories, categories => categories.products)
  cate: Categories;

  @ManyToOne(() => Brand, brand => brand.products)
  brands: Brand[];


  // một sản phẩm có thể có nhiều màu


}