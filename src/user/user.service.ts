import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";
import { Role, User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from "bcrypt";
import { UserProfilePictureDto } from "./dto/put-user-profile_picture.dto";
import { EditUserProfile } from "./dto/put-user-profile.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { APIFeatures } from "./APIFeatures";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>
  ) {
  }

  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user: User = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  public async getByEmail(email: string): Promise<User> {
    const user: User = await this.userRepository
      .createQueryBuilder("user")
      .addSelect("user.password")
      .where("user.email = :email", { email })
      .getOne();
    if (!user)
      throw new HttpException("Email này không tồn tại", HttpStatus.NOT_FOUND);
    return user;
  }

  public async getPasswordById(userId: number): Promise<User> {
    return await this.userRepository.findOne({
      where: { userId: userId },
      select: ["password"]
    });
  }

  public async getById(userId: number): Promise<User> {
    const user: User = await this.userRepository.findOne({ where: { userId } });
    if (user) return user;
    throw new HttpException("Người dùng này không tồn tại", HttpStatus.NOT_FOUND);
  }

  public async setCurrentRefreshToken(refreshToken: string, userId: number): Promise<any> {
    const currentHashedRefreshToken: string = await bcrypt.hash(refreshToken, 10);
    return await this.userRepository.update(userId, {
      refreshToken: currentHashedRefreshToken
    });
  }

  public async getUserIfRefreshTokenMatches(refReshToken: string, userId: number): Promise<User> {
    const user: User = await this.getById(userId);
    const isRefreshTokenMatching: boolean = await bcrypt.compare(refReshToken, user.refreshToken);
    if (isRefreshTokenMatching) return user;
  }

  public async removeRefreshToken(userId: number) {
    if (!userId) throw new HttpException("id not found", HttpStatus.NOT_FOUND);
    return await this.userRepository.update(userId, { refreshToken: null });
  }

  public async updateUserprofile_pictureOne(userId: number, userProfilePictureDto: UserProfilePictureDto): Promise<any> {
    await this.getById(userId);
    await this.userRepository.update(userId, {
      profile_picture: userProfilePictureDto.profile_picture
    });
  }

  public async updateUserName_gender_phone(userId: number, editUserProfile: EditUserProfile): Promise<any> {
    await this.getById(userId);
    await this.userRepository.update(userId, {
      first_name: editUserProfile.first_name,
      phone_number: editUserProfile.phone_number,
      gender: editUserProfile.gender
    });
  }

  public async deleteUser(userId: number): Promise<void> {
    await this.userRepository.delete(userId);
  }

  public async changePassword(userId: number, changePasswordDto: ChangePasswordDto): Promise<any> {
    const user: User = await this.getPasswordById(userId);
    const comparePassword: boolean = await bcrypt.compare(
      changePasswordDto.oldPassword,
      user.password
    );
    console.log(!comparePassword);
    if (!comparePassword) {
      throw new HttpException("PassWord cu khong dung", HttpStatus.NOT_FOUND);
    } else {
      const newHashPassWord: string = await bcrypt.hash(changePasswordDto.newPassword, 10);
      await this.userRepository.update(userId, { password: newHashPassWord });
    }
  }

  public async updateResetTokenUser(userId: number, resetToken: string, expiryDate: Date): Promise<any> {
    await this.userRepository.update(userId, { resetToken: resetToken, expiryDate });
  }

  public async findToken(token: string): Promise<User> {
    return await this.userRepository.findOne({ where: { resetToken: token } });
  }

  public async updateUserPassword(userId: number, newPassword: string): Promise<any> {
    return await this.userRepository.update(userId, { password: newPassword });
  }

  public async deleteUsersByIds(userIds: number[]): Promise<void> {
    // Lọc người dùng quản trị
    const nonAdmin: number[] = await Promise.all(
      userIds.map(async (id) => {
        const user: User | null = await this.getById(id);
        if (!user) {
          console.error(`Error deleting user with ID: ${id}`);
          throw new HttpException("User not found", HttpStatus.NOT_FOUND);
        }
        //Nếu người dùng không phải là quản trị viên, nó sẽ trả về id.
        // Nếu người dùng là quản trị viên, nó sẽ trả về null.
        return user.role !== Role.Admin ? id : null;
      })
    );
    //Xóa giá trị null (tương ứng với người dùng quản trị viên)
    const userIdsRolecustomer: number[] = nonAdmin.filter(id => id !== null);

    //Tiến hành xóa nếu có người dùng không phải quản trị viên cần xóa
    if (userIdsRolecustomer.length > 0) {
      await this.userRepository.delete(userIdsRolecustomer);
    }

  }

  // tìm kiếm người dùng theo name.
  public async findByName(name: string): Promise<User> {
    const user: User = await this.userRepository.findOne({ where: [{ first_name: name }] });
    if (!user) throw new HttpException("Không tìm thấy", HttpStatus.NOT_FOUND);
    return user;
  }

  public async getUsers(query: string[]): Promise<any> {
    const queryBuilder: SelectQueryBuilder<User> = this.userRepository.createQueryBuilder("user");
    const features: APIFeatures<User> = new APIFeatures(queryBuilder, query);
    (await (await (await (await (await (await features.filter()).sort()).limitFields()).paginate()).getUserIsActive()).count());
    const users: User[] = await features.exec();
    const total: number = features.getTotalCount();
    return {
      total,
      users
    };
  }

  public async getAll(query: any): Promise<any> {
    const queryBuilder: SelectQueryBuilder<User> = this.userRepository.createQueryBuilder("user");
    const count: number = await queryBuilder.getCount();

    queryBuilder
      .select([
        "user.userId",
        "user.first_name",
        "user.email",
        "user.phone_number",
        "user.profile_picture",
        "user.gender",
        "user.role",
        "user.createdAt"
      ]);
    if (query.page && query.limit) {
      const page: number = parseInt(query.page, 10) || 1;
      const limit: number = parseInt(query.limit, 10) || 10;
      const skip: number = (page - 1) * limit;
      queryBuilder.skip(skip).take(limit);
    }
    const users: User[] = await queryBuilder.getMany();
    return {
      total: count,
      data: users
    };
  }

  public async setUserActiveStatus(userId: number, isActive: boolean): Promise<void> {
    await this.userRepository.update(userId, { isActive: isActive });

  }

  public async getActiveUsers(): Promise<User[]> {
    return await this.userRepository.find({ where: { isActive: true } });
  }


}
