import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  Put,
  UseInterceptors,
  UploadedFile,
  Query,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto, UserFiltersDto } from "./dto/user.dto";
import { UpdateUserDto } from "./dto/user.dto";
import { AuthGuard } from "../../common/guards/auth.guard";
import { LoggedUser } from "../../common/decorators/user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { ValidationPipe } from "../../common/pipes/validation.pipe";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { ChangePasswordDto } from "./auth/dto/password.dto";
import { FileInterceptor } from "@nestjs/platform-express";

// @UseGuards(new AuthGuard())
@UsePipes(new ValidationPipe())
@ApiBearerAuth()
@ApiTags("Users")
@Controller("api/users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles("admin")
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll(@Query() options: UserFiltersDto) {
    return this.userService.findAll(options);
  }

  @Get("me")
  async getProfile(@LoggedUser() currentUser) {
    return await this.userService.profile(currentUser);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.userService.findOne(id);
  }

  @Put("change-password")
  changePassword(@LoggedUser() currentUser, @Body() data: ChangePasswordDto) {
    return this.userService.changePassword(currentUser, data);
  }

  @Put(":id")
  @UseInterceptors(FileInterceptor("thumbnail"))
  @ApiConsumes("multipart/form-data")
  async update(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile()
    file: Express.Multer.File
  ) {
    return await this.userService.update(id, updateUserDto, file);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.userService.remove(id);
  }
}
