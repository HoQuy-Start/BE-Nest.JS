Xác thực:
1.Đăng ký: (Đăng ký người dùng mới) POST
http://localhost:3000/api/v2/auth/register

2.Đăng nhập: (Đăng nhập người dùng) POST
http://localhost:3000/api/v2/auth/log-in

3.Làm mới mã thông báo: (Làm mới mã thông báo truy cập đã hết hạn) GET
http://localhost:3000/api/v2/auth/refresh

4.Đăng xuất: (Đăng xuất người dùng) POST
http://localhost:3000/api/v2/auth/log-out

Quản lý người dùng:
5.Chỉnh sửa hồ sơ: (Chỉnh sửa thông tin hồ sơ của người dùng. Tham số có thể được thay thế bằng ID người dùng thực tế
trong quá trình yêu cầu) PUT
http://localhost:3000/api/v2/auth/edit-profile/:userId:userId

6.Tải lên ảnh hồ sơ: (Tải ảnh hồ sơ mới cho người dùng. Tương tự như Chỉnh sửa hồ sơ, được thay thế bằng ID người dùng
thực tế) PUT
http://localhost:3000/api/v2/auth/upload-picture/:userId

7.Xóa người dùng (Chỉ dành cho quản trị viên):DELETE
http://localhost:3000/api/v2/auth/admin/deleteUser/:userId

8.Xóa người dùng (Người dùng muốn xóa tài khoản):DELETE
http://localhost:3000/api/v2/auth/deleteUser/:userId

9.Xóa người dùng (Nhiều) (Chỉ dành cho quản trị viên):DELETE
http://localhost:3000/api/v2/auth/delete-users-multiple

10.Đổi mật khẩu: (Cho phép người dùng thay đổi mật khẩu) PUT
http://localhost:3000/api/v2/auth/changePassword-user

11.Quên mật khẩu: (Có thể bắt đầu quá trình đặt lại mật khẩu cho người dùng quên mật khẩu) POST
http://localhost:3000/api/v2/auth/forgot-password

12.Đặt lại mật khẩu: (Có khả năng cho phép đặt lại mật khẩu sau khi yêu cầu quên mật khẩu) PUT
http://localhost:3000/api/v2/auth/reset-password

13.Tìm kiếm theo key-Word: GET
http://localhost:3000/api/v2/auth/finByName

14.Lọc,Tìm kiếm,Phân trang,Sắp xếp:GET
http://localhost:3000/api/v2/auth/APIFeatures

15.List User và Phân trang: GET
http://localhost:3000/api/v2/auth/getAll



















import { SelectQueryBuilder } from "typeorm";

export class APIFeatures<T> {
private readonly queryString: any;
private query: SelectQueryBuilder<T>;

constructor(query: SelectQueryBuilder<T>, queryString: any) {
this.query = query;
this.queryString = queryString;
}

public async filter(): Promise<any> {

    const queryObj = { ...this.queryString };

    const excludedFields: string[] = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((element: string) => delete queryObj[element]);

    let queryStr: string = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match: string): string => `${match}`);

    const filters = JSON.parse(queryStr);
    for (const [key, value] of Object.entries(filters)) {
      if (key.includes("gte")) {
        this.query = this.query.andWhere(`${key.split("gte")[0]} >= :value`, { value });
      } else if (key.includes("gt")) {
        this.query = this.query.andWhere(`${key.split("gt")[0]} > :value`, { value });
      } else if (key.includes("lte")) {
        this.query = this.query.andWhere(`${key.split("lte")[0]} <= :value`, { value });
      } else if (key.includes("lt")) {
        this.query = this.query.andWhere(`${key.split("lt")[0]} < :value`, { value });
      } else {
        this.query = this.query.andWhere(`${key} = :value`, { value });
      }
    }

}

// public async sort(): Promise<any> {
// if (this.queryString.sort) {
//
// const sortBy = this.queryString.sort.split(",").join(" ");
// this.query = this.query.orderBy(sortBy);
// } else {
// this.query = this.query.orderBy("createdAt", "DESC");
// }
// }

// limitFields(): this {
// if (this.queryString.fields) {
// const fields = this.queryString.fields.split(",").join(" ");
// this.query = this.query.select(fields.split(" "));
// } else {
// this.query = this.query.select(["*"]);
// }
//
// return this;
// }

// paginate(): this {
// const page: number = this.queryString.page * 1 || 1;
// const limit: number = this.queryString.limit * 1 || 10;
// const skip: number = (page - 1) * limit;
//
// this.query = this.query.skip(skip).take(limit);
//
// return this;
// }

async exec(): Promise<T[]> {
return await this.query.getMany();
}

}

Có, tôi biết về xâu chuỗi phương thức (method chaining).

Xâu chuỗi phương thức là kỹ thuật lập trình cho phép gọi liên tiếp nhiều phương thức trên một đối tượng, với kết quả của
phương thức trước được truyền trực tiếp cho phương thức tiếp theo. Kỹ thuật này thường được sử dụng trong lập trình
hướng đối tượng để tạo ra các chuỗi thao tác ngắn gọn và dễ đọc.

Lợi ích của xâu chuỗi phương thức:

Mã ngắn gọn và dễ đọc: Xâu chuỗi phương thức giúp mã ngắn gọn và dễ đọc hơn, đặc biệt là khi bạn cần thực hiện nhiều
thao tác liên tiếp trên một đối tượng.
Dễ bảo trì: Xâu chuỗi phương thức giúp mã dễ bảo trì hơn, vì các thao tác được nhóm lại với nhau theo một cách logic.
Cải thiện hiệu suất: Trong một số trường hợp, xâu chuỗi phương thức có thể cải thiện hiệu suất bằng cách giảm số lượng
lần truy cập bộ nhớ.

const user = {
name: "John Doe",
email: "johndoe@example.com",
age: 30,
};

const formattedUser = user
.toUpperCase() // Biến đổi tên thành chữ hoa
.replace(/ /g, "_") // Thay thế dấu cách bằng dấu gạch dưới
.toLowerCase(); // Biến đổi tên thành chữ thường

console.log(formattedUser); // Output: JOHN_DOE
Chuỗi phương thức là một kỹ thuật trong đó nhiều phương thức được gọi trên một đối tượng trong một câu lệnh. Mỗi phương
thức trả về chính đối tượng đó (tức là this), cho phép gọi phương thức tiếp theo trên cùng một đối tượng. Điều này có
thể làm cho mã dễ đọc và ngắn gọn hơn.
import { SelectQueryBuilder } from "typeorm";

export class APIFeatures<T> {
private readonly queryString: any;
private query: SelectQueryBuilder<T>;

constructor(query: SelectQueryBuilder<T>, queryString: any) {
this.query = query;
this.queryString = queryString;
}

public filter(): this {
const queryObj = { ...this.queryString };
const excludedFields: string[] = ["page", "sort", "limit", "fields"];
excludedFields.forEach(element => delete queryObj[element]);

    let queryStr: string = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `${match}`);

    const filters = JSON.parse(queryStr);
    for (const [key, value] of Object.entries(filters)) {
      if (typeof value === "string") {
        this.query = this.query.andWhere(`${key} LIKE :${key}`, { [key]: `%${value}%` });
      } else {
        this.query = this.query.andWhere(`${key} = :${key}`, { [key]: value });
      }
    }
    return this; // Return the instance for chaining

}

public sort(): this {
if (this.queryString.sort) {
const sortBy = this.queryString.sort.split(",").join(" ");
this.query = this.query.orderBy(sortBy);
} else {
this.query = this.query.orderBy("user.createdAt", "DESC");
}
return this; // Return the instance for chaining
}

public async exec(): Promise<T[]> {
return await this.query.getMany();
}
}

Ngoài ra, còn có một số toán tử so sánh khác trong SQL:

= (Equal To): Bằng nhau.
!= (Not Equal To): Không bằng nhau.
IS NULL: Là null.
IS NOT NULL: Không phải null.
BETWEEN: Nằm trong một khoảng. Ví dụ, truy vấn sau sẽ lấy tất cả người dùng có tuổi từ 20 đến 30:
SELECT * FROM users WHERE age BETWEEN 20 AND 30;

Các toán tử so sánh chỉ hoạt động với các giá trị có cùng kiểu dữ liệu. Ví dụ, bạn không thể so sánh một giá trị VARCHAR
với một giá trị INT.
Bạn có thể kết hợp các toán tử so sánh bằng cách sử dụng các toán tử logic AND và OR. Ví dụ, truy vấn sau sẽ lấy tất cả
người dùng có tên là "Bard" hoặc tuổi là 20:
SELECT * FROM users WHERE name = 'Bard' OR age = 20;

public async sort(): Promise<this> {
console.log(this.queryString.sort);
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
Các replace Phương thức trong JavaScript được sử dụng để tìm kiếm một mẫu trong chuỗi (thường là chuỗi con)
và thay thế nó bằng chuỗi con mới.Đây là bảng phân tích cú pháp và cách sử dụng của nó: