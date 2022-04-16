import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateAlertDto } from "./dto/create-alert.dto";
import { UpdateAlertDto } from "./dto/update-alert.dto";
import { Alert } from "./entities/alert.entity";

@Injectable()
export class AlertService {
  constructor(
    @InjectRepository(Alert) private alertRepository: Repository<Alert>
  ) {}

  async create(createAlertDto: CreateAlertDto) {
    const alert = await this.alertRepository.create(createAlertDto);

    return this.alertRepository.save(alert);
  }

  async findAll() {
    return this.alertRepository
      .createQueryBuilder("alert")
      .leftJoin("alert.receiver", "receiver")
      .addSelect("receiver.id")
      .addSelect("receiver.first_name")
      .addSelect("receiver.last_name")
      .leftJoin("alert.handler", "handler")
      .addSelect("handler.id")
      .addSelect("handler.first_name")
      .addSelect("handler.last_name")
      .getMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} alert`;
  }

  update(id: number, updateAlertDto: UpdateAlertDto) {
    return `This action updates a #${id} alert`;
  }

  remove(id: number) {
    return `This action removes a #${id} alert`;
  }
}
