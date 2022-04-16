import { ApiProperty } from "@nestjs/swagger";
import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Length,
} from "class-validator";
import { SameAs } from "../../../../common/decorators/validation.decorator";

export class RegisterUserDto {
  @IsNotEmpty()
  @ApiProperty()
  first_name: string;

  @IsNotEmpty()
  @ApiProperty()
  last_name: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsDefined()
  @Length(6)
  @ApiProperty()
  @SameAs("password_confirm", {
    message: "Password confirmation doesn't match.",
  })
  password: string;

  @IsNotEmpty()
  @IsDefined()
  @Length(6)
  @ApiProperty()
  password_confirm: string;

  @ApiProperty()
  @IsOptional()
  role: string;
}

export class LoginUserDto {
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsDefined()
  @Length(6)
  @ApiProperty()
  password: string;
}
