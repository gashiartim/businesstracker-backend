import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateLocationDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  description: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @ApiProperty()
  lat: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @ApiProperty()
  lng: string;
}
