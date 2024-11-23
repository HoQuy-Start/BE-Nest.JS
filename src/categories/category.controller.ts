import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { Categories } from "./entities/categories.entity";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { JwtAuthGuard } from "src/auth/jwt/jwt-auth.guard";
import { Roles } from "src/auth/roles/roles.decorator";
import { Role } from "src/user/entities/user.entity";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Controller("categories")
export class CategoryController {
  constructor(private readonly categoriesService: CategoriesService) {
  }

  @Post("create-category")
  public async createCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<Categories> {
    return await this.categoriesService.createCategory(createCategoryDto);
  }
  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  @Post()
  async create(@Body() createCatetDto: CreateCategoryDto, @Req() req: Request & { user: any }) {
    createCatetDto.parent = req.user.user.id;
    const res = await this.categoriesService.createCategory(createCatetDto);
    delete res.user.password;
    delete res.user.refreshToken;
    return {
      statuscode: 200,
      message: "thêm mới thành công",
      result: res
    }
  }
  @Get('')
  async findAll(): Promise<Categories[]> {
    return await this.categoriesService.findAll();
  }

  //getCateByUser
  @UseGuards(JwtAuthGuard)
  @Get('/getCateByUser')
  async getCateByUser(@Req() req: Request & { user: any }): Promise<Categories[]> {
    const userid = req.user.user.id
    return await this.categoriesService.findByUser(userid);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string): Promise<Category> {
  //   return this.categoryService.findOne(+id);
  // }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateCategory: UpdateCategoryDto, @Req() req: Request & { user: any }) {
    updateCategory.userid = req.user.user.id;
    const update = await this.categoriesService.update(id, updateCategory);
    return {
      statuscode: 200,
      message: "cập nhật thành công",
      result: update
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const destroyed = await this.categoriesService.remove(+id);
    return {
      statuscode: 200,
      message: "xóa thành công",
      result: destroyed
    }
  }
}