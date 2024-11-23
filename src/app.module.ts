import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user/entities/user.entity";
import { AuthenticationModule } from "./auth/authentication.module";
import { APP_GUARD } from "@nestjs/core";
import { RolesGuard } from "./auth/roles/roles.guard";
import { ConfigModule } from "@nestjs/config";
import { ActivityMiddleware } from "./user/ActivityMiddleware";
import { Categories } from "./categories/entities/categories.entity";
import { CategoriesModule } from "./categories/categories.module";
import { Product } from "./product/entities/product.entity";
import { ProductModule } from "./product/product.module";
import { Color } from "./color/entities/color.entity";
import { Size } from "./size/entities/size.entity";
import { ColorModule } from "./color/color.module";
import { SizeModule } from "./size/size.module";
import { Brand } from "./brand/entities/brand.entity";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DATABASE_TYPE,
      port: Number(process.env.DATABASE_PORT) || 0,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User, Categories, Product, Color, Size,Brand],
      synchronize: true,
      autoLoadEntities: true
    }),
    UserModule,
    AuthenticationModule,
    CategoriesModule,
    ProductModule,
    ColorModule,
    SizeModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    }
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ActivityMiddleware)
      .forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
