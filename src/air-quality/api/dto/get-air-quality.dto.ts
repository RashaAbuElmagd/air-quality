import { IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetAirQualityDto {
  @ApiProperty({
    description: 'Latitude coordinate',
    example: 48.856613,
    minimum: -90,
    maximum: 90
  })
  @IsNumber()
  @Type(() => Number)
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty({
    description: 'Longitude coordinate',
    example: 2.352222,
    minimum: -180,
    maximum: 180
  })
  @IsNumber()
  @Type(() => Number)
  @Min(-180)
  @Max(180)
  longitude: number;
} 