import { Body, Controller, Param, Post, Res, UsePipes } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginUserDto, RegisterUserDto } from "./dto/register-user.dto";
import { ValidationPipe } from "../../../common/pipes/validation.pipe";
import { ResetPasswordDto } from "./dto/password.dto";

@Controller("api/auth")
@ApiTags("Authentication")
@UsePipes(new ValidationPipe())
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post("/register")
  async register(@Body() auth: RegisterUserDto): Promise<any> {
    return await this.authService.register(auth);
  }

  @Post("/login")
  async login(@Body() auth: LoginUserDto): Promise<any> {
    return await this.authService.login(auth);
  }
  @Post("/set-new-password/:token")
  async setNewPassword(
    @Param("token") token: string,
    @Body() data: ResetPasswordDto,
    @Res() res
  ) {
    return await this.authService.setPassword(token, data, res);
  }
}
