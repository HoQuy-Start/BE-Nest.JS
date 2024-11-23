import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { DeleteResult, In, Repository } from 'typeorm';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class CartService {
  constructor(@InjectRepository(Cart) private readonly cartrepository: Repository<Cart>,
    @InjectRepository(Product) private readonly proRepository: Repository<Product>,
    @InjectRepository(User) private readonly userrepository: Repository<User>

  ) { }

  async queryBuiler(alias: string) {
    return this.cartrepository.createQueryBuilder(alias)
  }

  async create(createCartDto: CreateCartDto) {
    const product = await this.proRepository.findOne({ where: [{ 'id': createCartDto.productid }] });
    const user = await this.userrepository.findOne({ where: [{ 'id': createCartDto.userid }] });
    //check cart
    const userid = createCartDto.userid;
    const productid = createCartDto.productid;
    const builder = (await this.queryBuiler('cart'))
      .innerJoinAndSelect('cart.user', 'user', 'cart.userid = user.id')
      .where('cart.productid = :productid', { productid }).andWhere('cart.userid = :userid', { userid })
    const checkCart = await builder.getOne();
    //

    //checkCart == true
    if (checkCart && createCartDto.userid == checkCart.user.id) {
      createCartDto.quantity = Number(createCartDto.quantity)
      createCartDto.quantity += checkCart.quantity;
      delete createCartDto.productid
      delete createCartDto.userid
      let dataCreate = this.cartrepository.create({
        ...createCartDto,
        product: product,
        user: user
      });
      const newCart = await this.cartrepository.update(checkCart.id, dataCreate);
      return newCart
    }

    // checkCart = false
    delete createCartDto.productid
    delete createCartDto.userid
    let dataCreate = this.cartrepository.create({
      ...createCartDto,
      product: product,
      user: user
    });

    const newCart = await this.cartrepository.save(dataCreate);
    delete newCart.user.password;
    delete newCart.user.refresh_token;
    return newCart
  }

  async getCart(userid: number) {

    const builder = (await this.queryBuiler('cart'))
      .innerJoinAndSelect('cart.product', 'product', 'cart.productid = product.id')
      .leftJoinAndMapOne('product.restaurant', 'product.user', 'user', 'product.userid = user.id')
      .where('cart.userid = :userid', { userid })


    const carts = await builder.getMany();
    return carts
  }

  async update(id: number, updateCartDto: UpdateCartDto) {

    let dataCreate = {
      id: id,
      ...updateCartDto,
    };
    return await this.cartrepository.update(id, dataCreate)
  }

  async remove(id: number): Promise<DeleteResult> {
    const destroyed = await this.cartrepository.delete(id)
    return destroyed
  }
  async removeMany(id: any) {
    const removeAll = await this.cartrepository.delete({ id: In(id) })
    return removeAll
  }
}
