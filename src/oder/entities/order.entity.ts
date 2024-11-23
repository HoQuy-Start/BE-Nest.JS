
import { Restaurant } from "src/restaurant/entities/restaurant.entity";
import { StatusOder } from "src/status_oder/entities/status_oder.entity";
import { User } from "src/user/entities/user.entity";
import { UserAddress } from "src/user_address/entities/user_address.entity";
import { Column, Entity, Index, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { Voucher } from "src/voucher/entities/voucher.entity";
import { OrderDetail } from "src/orderdetail/entities/orderdetail.entity";
@Entity('order')
// @Index(['driverId', 'userId'])
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 255,
        charset: 'utf8mb4',
        collation: 'utf8mb4_unicode_ci',
    })
    note: string;

    @Column({ type: "timestamp", default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date

    @Column({ type: "timestamp", default: () => 'CURRENT_TIMESTAMP' })
    update_at: Date

    @ManyToOne(() => UserAddress, user_address => user_address.order)
    @JoinColumn()
    user_address: UserAddress;

    @ManyToOne(() => User, restaurant => restaurant.order_restaurant)
    @JoinColumn()
    restaurant: User;

    @ManyToOne(() => StatusOder, status => status.order)
    @JoinColumn()
    status: StatusOder;

    @OneToMany(() => OrderDetail, order_detail => order_detail.order)
    order_detail: OrderDetail;

    @ManyToOne(() => User, driver => driver.order_driver)
    @JoinColumn({ name: "driverId" })
    driver: User;

    @ManyToOne(() => User, user => user.order)
    @JoinColumn({ name: "userId" })
    user: User;
    @ManyToOne(() => Voucher, voucher => voucher.order)
    voucher: Voucher
}
