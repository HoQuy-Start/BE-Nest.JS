import { config } from "dotenv";

config();
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import * as path from "path";
import * as express from "express";


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api/v2");
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  const uploadsPath: string = path.join(__dirname, "..", "uploads");
  app.use("/uploads", express.static(uploadsPath));
  await app.listen(3000);
}

bootstrap();
