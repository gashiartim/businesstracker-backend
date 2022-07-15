import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./api/user/user.module";
import { RoleModule } from "./api/role/role.module";
import { PermissionModule } from "./api/permission/permission.module";
import SetUserToContextMiddleware from "./common/middlewares/setUserToContext.middleware";
import { LoggerMiddleware } from "./common/middlewares/logger.middleware";
import { LocationModule } from "./api/location/location.module";
import { AlertModule } from "./api/alert/alert.module";
import { AppGateway } from "./app.gateway";
import { MediaModule } from "./api/media/media.module";
import { MulterModule } from "@nestjs/platform-express";
import {
  multerConfig,
  multerOptions,
} from "./common/middlewares/multer.middleware";
import { join } from "path";
import { ServeStaticModule } from "@nestjs/serve-static";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "../"),
    }),

    TypeOrmModule.forRoot(),
    ConfigModule.forRoot(),
    UserModule,
    RoleModule,
    UserModule,
    PermissionModule,
    LocationModule,
    AlertModule,
    MulterModule.register({
      ...multerConfig,
      ...multerOptions,
    }),
    MediaModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SetUserToContextMiddleware)
      .forRoutes({ path: "*", method: RequestMethod.ALL });

    //Test middleware showing how to exclude routes when you use a middleware
    //This middleware has no function
    consumer
      .apply(LoggerMiddleware)
      .exclude({ path: "/api/users/me", method: RequestMethod.GET })
      .forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
