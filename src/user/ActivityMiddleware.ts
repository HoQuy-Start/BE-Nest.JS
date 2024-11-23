import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service";
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class ActivityMiddleware implements NestMiddleware {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {
  }

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies?.accessToken;
      const decodedToken = this.jwtService.decode(token);

      if (decodedToken?.sub) {
        const userId = decodedToken.sub;
        await this.userService.setUserActiveStatus(userId, true);

        // res.on("finish", async () => { // nó xẽ gọi lại ngay lập tức. nó như close :Đóng kết nối
        //   try {
        //     console.log('finish');
        //     await this.userService.setUserActiveStatus(userId, false);
        //   } catch (error) {
        //     console.error("Lỗi cài đặt người dùng không hoạt động:", error);
        //   }
        // });
      } else {
        // console.log("Không tìm thấy người dùng nào trong mã thông báo");
      }
    } catch (error) {
      console.error("Lỗi xử lý mã thông báo:", error);
    }

    next();
  }

}