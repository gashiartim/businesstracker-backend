import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class AlertFiltersDto {
  @ApiPropertyOptional()
  @IsOptional()
  sentTo: string;
}
