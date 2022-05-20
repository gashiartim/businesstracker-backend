import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { HashService } from "../../services/hash/HashService";
import { Repository } from "typeorm";
import { ChangePasswordDto } from "./auth/dto/password.dto";
import { RegisterUserDto } from "./auth/dto/register-user.dto";
import { CreateUserDto, UserFiltersDto } from "./dto/user.dto";
import { UpdateUserDto } from "./dto/user.dto";
import { User } from "./entities/user.entity";
import { MediaService } from "../media/media.service";
import { entityTypes, MediaMorph } from "../media/entities/media-morph.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly hashService: HashService,
    private readonly mediaService: MediaService
  ) {}

  async create(createUserDto: CreateUserDto) {
    await this.checkIfEmailExists(createUserDto.email);

    const user = await this.userRepository.create(createUserDto);

    await this.userRepository.save(user);
    return await this.userRepository.findOne(user.id);
  }

  async findAll(options: UserFiltersDto) {
    const queryBuilder = this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.role", "role");
    // .getMany();

    if (options.patrols) {
      queryBuilder.where("role.slug = (:roleParam)", {
        roleParam: "patrol",
      });
    }

    const users = await queryBuilder.getMany();

    return users.map((user) => {
      const { password, ...userWithoutPassword } = user;

      return userWithoutPassword;
    });
  }

  async profile(data: RegisterUserDto): Promise<User> {
    return await this.findUserByEmail(data.email);
  }

  async findOne(id: string) {
    return await this.getRequestedUserOrFail(id);
  }

  //TODO: Email update and also validation
  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    file?: Express.Multer.File
  ) {
    await this.getRequestedUserOrFail(id);

    await this.userRepository.update(id, { ...updateUserDto });

    if (file) {
      const oldThumbnail = await this.mediaService.findOneById(id);
      if (oldThumbnail) {
        await this.mediaService.deleteFileFromUploadsFolder(
          oldThumbnail.media.url
        );
        await this.mediaService.deleteOneById(oldThumbnail.media_id);
      }

      await this.mediaService.uploadFileAndAttachEntity(
        file,
        {
          entity: "user",
          entity_id: id,
          related_field: entityTypes.THUMBNAIL,
        },
        id
      );
    }
    return await this.userRepository.findOne(id);
  }

  async remove(id: string) {
    await this.getRequestedUserOrFail(id);
    await this.userRepository.delete(id);
    return { message: "User was deleted successfully!" };
  }

  async getRequestedUserOrFail(id: string) {
    const user = await this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.role", "role")
      .leftJoinAndMapOne(
        "user.thumbnail",
        MediaMorph,
        "thumbnail",
        "thumbnail.entity_id = user.id AND thumbnail.entity = (:entity)",
        { entity: "user" }
      )
      .leftJoinAndSelect("thumbnail.media", "media")
      .where({ id })
      .getOne();

    if (!user) {
      throw new HttpException("User does not exists!", HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async checkIfEmailExists(email: string) {
    const user = await this.userRepository.findOne({ email });
    if (user) {
      throw new HttpException("User already exists!", HttpStatus.FOUND);
    }
    return user;
  }

  async findUserByEmail(email: string) {
    return await this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.role", "role")
      .leftJoinAndMapOne(
        "user.thumbnail",
        MediaMorph,
        "thumbnail",
        "thumbnail.entity_id = user.id AND thumbnail.entity = (:entity)",
        { entity: "user" }
      )
      .leftJoinAndSelect("thumbnail.media", "media")
      .where({ email })
      .getOne();
  }

  public async changePassword(user: any, data: ChangePasswordDto) {
    const userExists = await this.userRepository
      .createQueryBuilder("user")
      .addSelect("user.password")
      .where("user.id =:id", { id: user.id })
      .getOne();

    if (
      !(await this.hashService.compare(data.old_password, userExists.password))
    ) {
      throw new HttpException("Incorrect old password!", HttpStatus.CONFLICT);
    }

    return {
      message: "Password changed successfully!",
      user: await this.update(
        userExists.id as any,
        {
          password: await this.hashService.make(data.new_password),
        } as any
      ),
    };
  }
}
