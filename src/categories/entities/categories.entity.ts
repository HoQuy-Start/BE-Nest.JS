import { Column, Entity, PrimaryGeneratedColumn, TreeParent, TreeChildren, Tree, OneToMany, ManyToOne } from "typeorm";
import { Product } from "../../product/entities/product.entity";
import { User } from "src/user/entities/user.entity";


@Entity("categories")
@Tree("closure-table")
export class Categories {

  @PrimaryGeneratedColumn()
  categoryId: number;

  @Column({ unique: true })
  categoryName: string;

  @TreeParent()
  parent: Categories;

  @TreeChildren({ cascade: true })
  children: Categories[];

  @OneToMany(() => Product, (product: Product) => product.cate)
  products: Product[];

  @ManyToOne(() => User, user => user.category)
  user: User



}