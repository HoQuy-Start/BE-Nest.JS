import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Categories } from "./entities/categories.entity";
import { DeleteResult, Repository, TreeRepository, UpdateResult } from "typeorm";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { MysqlErrorCode } from "../result_errors_enums/mysql-error-code.enum";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { User } from "src/user/entities/user.entity";

@Injectable()
export class CategoriesService {
  private treeRepository: TreeRepository<Categories>;

  constructor(
    @InjectRepository(Categories) private readonly categoriesRepository: Repository<Categories>,
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {
    this.treeRepository = this.categoriesRepository.manager.getTreeRepository(Categories);
  }

  async findAll(): Promise<Categories[]> {
    return this.treeRepository.findTrees();
  }

  public async createCategory(createCategoryDto: CreateCategoryDto): Promise<Categories> {
    try {
      if (!createCategoryDto.parent) {
        const newCategory: Categories = new Categories();
        newCategory.categoryName = createCategoryDto.categoryName;
        return await this.categoriesRepository.save(newCategory);
      } else {
        const parentId: number = createCategoryDto.parent;
        const parent: Categories | null = await this.categoriesRepository.findOne({ where: { categoryId: parentId } });
        if (!parent) {
          throw new Error("Không tìm thấy danh mục cha");
        }
        const newCategory: Categories = new Categories();
        newCategory.categoryName = createCategoryDto.categoryName;
        newCategory.parent = parent;
        return await this.categoriesRepository.save(newCategory);
      }
    } catch (error) {
      if (error?.code === MysqlErrorCode.UniqueViolation) {
        throw new HttpException("Unique", HttpStatus.BAD_REQUEST);
      }
      throw new HttpException("Đã xảy ra lỗi", HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }
  async findByUser(userid: number): Promise<Categories[]> {
    const cateByUser = (await this.queryBuiler('category'))
      .innerJoinAndSelect('category.user', 'user', 'category.userid = user.id')
      .getMany();
    (await cateByUser).forEach((cate) => {
      if (cate.user.userId == userid) {
        delete cate.user.password;
        delete cate.user.refreshToken;
      } else {
        delete cate.user;
      }
    })
    return cateByUser
  }
  async queryBuiler(alias: string) {
    return this.categoriesRepository.createQueryBuilder(alias)
  }

  async findOne(id: number): Promise<Categories> {
    const check = await this.categoriesRepository.findOne({ where: [{ categoryId: id }] });
    if (!check) {
      throw new ConflictException('không có thư mục nào tên này')
    }
    return check
  }
  async update(id: number, updatecateDto: UpdateCategoryDto): Promise<UpdateResult> {
    const check = await this.categoriesRepository.findOne({ where: { categoryName: updatecateDto.name } });
    const curCate = await this.categoriesRepository.findOne({ where: [{ categoryId: id }] });
    const checkProByCate = await (await this.queryBuiler('category'))
      .innerJoinAndSelect('category.product', 'product', 'category.id = product.categoryid')
      .where('category.id = :id', { id })
      .getMany();
    if (check) {
      if (curCate.categoryName == updatecateDto.name) {
        if (checkProByCate.length > 0) {
          updatecateDto.status = "Available";
        } else {
          updatecateDto.status = "Out of stock";
        }
        delete updatecateDto.userid

      }
      throw new ConflictException('đã có danh mục này rồi')
    }
    if (checkProByCate.length > 0) {
      updatecateDto.status = "Available";
    } else {
      updatecateDto.status = "Out of stock";
    }
    delete updatecateDto.userid
    return null;

  }

  async remove(id: number): Promise<DeleteResult> {
    const categoryCheck = await (await this.queryBuiler('category'))
      .innerJoinAndSelect('category.product', 'product', 'category.id=product.category.id').where('category.id = :id ', { id }).getOne();

    if (categoryCheck) {
      throw new BadRequestException('category hiện đang có sản phẩm')
    }
    const destroyed = await this.categoriesRepository.delete(id)
    return destroyed
  }
}