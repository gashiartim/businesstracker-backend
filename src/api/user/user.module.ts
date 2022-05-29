import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { AuthController } from "./auth/auth.controller";
import { AuthService } from "./auth/auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { ConfigModule } from "@nestjs/config";
import { AuthServiceGeneral } from "../../services/auth/AuthService";
import { RoleService } from "../role/role.service";
import { Role } from "../role/entities/role.entity";
import { HashService } from "../../services/hash/HashService";
import { MediaService } from "../media/media.service";
import { MediaMorph } from "../media/entities/media-morph.entity";
import { MulterModule } from "@nestjs/platform-express";
import {
  multerConfig,
  multerOptions,
} from "../../common/middlewares/multer.middleware";
import { Media } from "../media/entities/media.entity";

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, Role, Media, MediaMorph]),
    MulterModule.register({ ...multerConfig, ...multerOptions }),
  ],
  controllers: [UserController, AuthController],
  providers: [
    UserService,
    AuthService,
    AuthServiceGeneral,
    HashService,
    RoleService,
    MediaService,
  ],
  exports: [UserService],
})
export class UserModule {}
