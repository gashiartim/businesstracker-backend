import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateLocationDto } from "./dto/create-location.dto";
import { UpdateLocationDto } from "./dto/update-location.dto";
import { Location } from "./entities/location.entity";

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private locationRepo: Repository<Location>
  ) {}

  async create(createLocationDto: CreateLocationDto) {
    await this.checkIfExists(createLocationDto.lat, createLocationDto.lng);

    const newLocation = await this.locationRepo.create(createLocationDto);
    return this.locationRepo.save(newLocation);
  }

  async findAll() {
    const locations = await this.locationRepo.find();

    return {
      count: locations.length,
      data: locations,
    };
  }

  findOne(id: string) {
    return this.getRequestedLocationOrFail(id);
  }

  async update(id: string, updateLocationDto: UpdateLocationDto) {
    const { lat, lng } = await this.getRequestedLocationOrFail(id);

    const { lat: newLat, lng: newLng } = updateLocationDto;

    if (lat !== newLat.toString() || lng !== newLng.toString()) {
      await this.checkIfExists(newLat, newLng);
    }

    await this.locationRepo.update(id, updateLocationDto);

    return this.getRequestedLocationOrFail(id);
  }

  async remove(id: string) {
    const location = await this.getRequestedLocationOrFail(id);

    await this.locationRepo.remove(location);

    return {
      success: "Location was deleted successfully!",
      location,
    };
  }

  async checkIfExists(lat: string, lng: string) {
    const locationExists = await this.locationRepo.findOne({ lat, lng });

    if (locationExists)
      throw new HttpException("Location already exists", HttpStatus.FOUND);

    return false;
  }

  async getRequestedLocationOrFail(id: string) {
    const location = await this.locationRepo.findOne(id);

    if (!location)
      throw new HttpException("Location doesn't exist", HttpStatus.NOT_FOUND);

    return location;
  }
}
