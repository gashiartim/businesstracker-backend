import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
} from "@nestjs/common";
import { ValidationPipe } from "src/common/pipes/validation.pipe";
import { AlertService } from "./alert.service";
import { CreateAlertDto } from "./dto/create-alert.dto";
import { UpdateAlertDto } from "./dto/update-alert.dto";

@Controller("api/alerts")
@UsePipes(new ValidationPipe())
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Post()
  create(@Body() createAlertDto: CreateAlertDto) {
    return this.alertService.create(createAlertDto);
  }

  @Get()
  findAll() {
    return this.alertService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.alertService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateAlertDto: UpdateAlertDto) {
    return this.alertService.update(+id, updateAlertDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.alertService.remove(+id);
  }
}
