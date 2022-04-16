import { Module } from "@nestjs/common";
import { AlertService } from "./alert.service";
import { AlertController } from "./alert.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Alert } from "./entities/alert.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Alert])],
  controllers: [AlertController],
  providers: [AlertService],
})
export class AlertModule {}
