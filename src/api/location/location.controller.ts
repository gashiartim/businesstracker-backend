import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UsePipes,
  UseGuards,
  Res,
} from "@nestjs/common";
import { LocationService } from "./location.service";
import { CreateLocationDto } from "./dto/create-location.dto";
import { UpdateLocationDto } from "./dto/update-location.dto";
import { ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/common/guards/auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";

@Controller("api/locations")
@ApiTags("locations")
@UsePipes(new ValidationPipe())
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @UseGuards(new AuthGuard())
  @UseGuards(new RolesGuard())
  @Roles("admin", "agent")
  @Post()
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationService.create(createLocationDto);
  }

  @Get()
  findAll() {
    return this.locationService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.locationService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateLocationDto: UpdateLocationDto
  ) {
    console.log("test updateLocationDto");

    return this.locationService.update(id, updateLocationDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string, @Res() res) {
    const result = await this.locationService.remove(id);

    if (result.success) {
      return res.json({
        ...result,
      });
    }
  }
}
