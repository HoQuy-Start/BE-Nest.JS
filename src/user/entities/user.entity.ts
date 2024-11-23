import { Categories } from "src/categories/entities/categories.entity";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

export enum Role {
  User = "user",
  Admin = "admin",
}

@Entity("user")
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column()
  first_name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column()
  phone_number: string;

  @Column({ nullable: true })
  profile_picture: string;

  @Column({
    nullable: true,
    type: "enum",
    enum: ["male", "female", "other"],
    default: "other"
  })
  gender: string;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ nullable: true, type: "enum", enum: Role, default: Role.User })
  role: Role;

  @Column({ nullable: true })
  resetToken: string;

  @Column({ nullable: true })
  expiryDate: Date;

  @Column({ default: false })
  isActive: boolean;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  @DeleteDateColumn({ type: "timestamp" })
  deletedAt: Date;

  @OneToMany(() => Categories, category => category.user)
  category: Categories[]
}
