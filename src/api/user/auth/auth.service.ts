import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { LoginUserDto, RegisterUserDto } from "./dto/register-user.dto";
import { AuthServiceGeneral } from "../../../services/auth/AuthService";
import { HashService } from "../../../services/hash/HashService";
import { RoleService } from "src/api/role/role.service";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly authService: AuthServiceGeneral,
    private readonly hashService: HashService,
    private readonly roleService: RoleService
  ) {}

  public async register(data: RegisterUserDto) {
    await this.checkIfEmailExists(data.email);

    const role = data.role
      ? await this.roleService.findOne(data.role)
      : await await this.roleService.getRoleBySlug("patrol");

    if (!role) {
      throw new HttpException("Role does not exists!", HttpStatus.NOT_FOUND);
    }

    let user = await this.userRepository.create({
      ...data,
      roleId: role.id,
      role,
    });

    await this.userRepository.save(user);

    user = await this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.role", "role")
      .where({ id: user.id })
      .getOne();

    const { password, ...userWithoutPassword } = user;

    return this.authService.sign(
      {
        userId: user.id,
      },
      { user: { ...userWithoutPassword, id: user.id, email: user.email } }
    );
  }

  public async login(data: LoginUserDto) {
    const { password, ...userWithoutPassword } = await this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.role", "role")
      .where("user.email =:email", { email: data.email })
      .getOne();

    // findOne({ email: data.email });

    if (!userWithoutPassword) {
      throw new Error("User does not exists!");
    }

    if (!(await this.hashService.compare(data.password, password))) {
      throw new HttpException(
        "Password does not match!",
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    const { access_token } = await this.authService.sign(
      { userId: userWithoutPassword.id, email: userWithoutPassword.email },
      { user: { id: userWithoutPassword.id, email: userWithoutPassword.email } }
    );

    return { user: { ...userWithoutPassword }, access_token };
  }

  public async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    return user;
  }

  public async checkIfEmailExists(email: string) {
    const user = await this.getUserByEmail(email);

    if (user) {
      throw new HttpException("Email already exists!", HttpStatus.FOUND);
    }

    return user;
  }
}
