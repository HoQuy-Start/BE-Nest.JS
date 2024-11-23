import { SelectQueryBuilder } from "typeorm";

export class APIFeatures<T> {
  private readonly queryString: any;
  private query: SelectQueryBuilder<T>;
  private totalCount: number;

  constructor(query: SelectQueryBuilder<T>, queryString: any) {
    this.query = query;
    this.queryString = queryString;
    this.totalCount = 0;
  }

  public async filter(): Promise<this> {

    const queryObj = { ...this.queryString };
    const excludedFields: string[] = ["page", "sort", "limit", "fields", "isActive"];
    excludedFields.forEach((element: string) => delete queryObj[element]);

    let queryStr: string = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match: string): string => `${match}`);

    // gte (Greater Than or Equal To): Lớn hơn hoặc bằng.
    // gt (Greater Than): Lớn hơn.
    // lte (Less Than or Equal To): Nhỏ hơn hoặc bằng.
    // lt (Less Than): Nhỏ hơn.
    const filters = JSON.parse(queryStr);
    for (const [key, value] of Object.entries(filters)) {
      if (typeof value === "string") {
        this.query = this.query.andWhere(`${key} LIKE :${key}`, { [key]: `%${value}%` });
      }
    }
    return this;
  }


  public async sort(): Promise<this> {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      // Tang dan
      const sortOrder = sortBy.includes("-") ? "DESC" : "ASC";
      //phát hiện dấu - xẽ là DESC
      const sortField = sortBy.replace(/-?(\w+)/, "$1");
      // console.log("sortField:", sortField,sortOrder);
      this.query = this.query.orderBy(sortField, sortOrder);
      // this.query.orderBy("createdAt", "DESC");
    } else {
      // Mặc định thứ tự giam dần
      this.query = this.query.orderBy("createdAt", "DESC");
    }
    return this;
  }

  public async limitFields(): Promise<this> {
    const fields: string[] = ["user.userId", "user.first_name", "user.email", "user.phone_number", "user.profile_picture", "user.gender", "user.isActive", "user.role", "user.createdAt"];
    this.query = this.query.select(fields);
    return this;
  }


  public async paginate(): Promise<this> {
    const page: number = this.queryString.page * 1 || 1;
    const limit: number = this.queryString.limit * 1 || 10;
    const skip: number = (page - 1) * limit;
    this.query = this.query.skip(skip).take(limit);
    return this;
  }

  public async getUserIsActive(): Promise<this> {
    const isActive = this.queryString.isActive === "true" ? true : false;
    if (isActive) {
      this.query = this.query.andWhere("user.isActive = :isActive", { isActive: isActive });
    } else {
      this.query = this.query.andWhere("user.isActive = :isActive", { isActive: isActive });
    }
    return this;
  }

  public async count(): Promise<this> {
    this.totalCount = await this.query.getCount();
    return this;
  }

  public getTotalCount(): number {
    return this.totalCount;
  }

  async exec(): Promise<T[]> {
    return await this.query.getMany();
  }

}

