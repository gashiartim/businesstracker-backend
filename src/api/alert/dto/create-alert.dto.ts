import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateAlertDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  message: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  location_id: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  sentTo: string;
}
  