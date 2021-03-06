import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from "class-validator";
import {
  Exists,
  IsUnique,
  SameAs,
} from "../../../common/decorators/validation.decorator";

export class CreateUserDto {
  @IsNotEmpty()
  @ApiProperty()
  first_name: string;

  @IsNotEmpty()
  @ApiProperty()
  last_name: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsEmail()
  @IsUnique(
    "User",
    "users",
    {},
    {
      message: "That email is taken",
    }
  )
  email: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  about: string;

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

  @IsNotEmpty()
  @ApiProperty()
  phone: string;

  @Exists(
    "Role",
    "roles",
    {
      field: "id",
      body_field: "roleId",
    },
    {
      message: "Role with this id doesn't exists",
    }
  )
  @ApiProperty()
  roleId: string;
}

export class UpdateUserDto {
  @IsOptional()
  @ApiProperty()
  first_name: string;

  @IsOptional()
  @ApiProperty()
  last_name: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty()
  email: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  about: string;

  @IsOptional()
  @Length(6)
  @ApiProperty()
  password: string;

  @IsOptional()
  @ApiProperty()
  phone: string;
}

export class UserFiltersDto {
  @ApiPropertyOptional()
  @IsOptional()
  patrols: boolean;
}
