import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AlertGateway } from "./alert.gateway";
import { AlertFiltersDto } from "./dto/alert-filter.dto";
import { CreateAlertDto } from "./dto/create-alert.dto";
import { UpdateAlertDto } from "./dto/update-alert.dto";
import { Alert } from "./entities/alert.entity";

@Injectable()
export class AlertService {
  constructor(
    @InjectRepository(Alert) private alertRepository: Repository<Alert>,
    private readonly alertGateway: AlertGateway
  ) {}

  async create(createAlertDto: CreateAlertDto) {
    const alert = await this.alertRepository.create(createAlertDto);
    const createdAlert = await this.alertRepository.save(alert);

    const alertData = await this.alertRepository
      .createQueryBuilder("alert")
      .leftJoinAndSelect("alert.location", "location")
      .where({ id: createdAlert.id })
      .getOne();

    this.alertGateway.onAlertSent({ ...alertData });

    return createdAlert;
  }

  async findAll(options: AlertFiltersDto) {
    const queryBuilder = this.alertRepository
      .createQueryBuilder("alert")
      .leftJoin("alert.receiver", "receiver")
      .addSelect("receiver.id")
      .addSelect("receiver.first_name")
      .addSelect("receiver.last_name")
      .leftJoin("alert.handler", "handler")
      .addSelect("handler.id")
      .addSelect("handler.first_name")
      .addSelect("handler.last_name")
      .leftJoinAndSelect("alert.location", "location");

    if (options.sentTo) {
      queryBuilder.where({ sentTo: options.sentTo });
    }

    return await queryBuilder.getMany();
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
