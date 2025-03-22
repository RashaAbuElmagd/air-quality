import { ApiProperty } from '@nestjs/swagger';

export class LocationDto {
  @ApiProperty({ example: 48.856613 })
  latitude: number;

  @ApiProperty({ example: 2.352222 })
  longitude: number;
}

export class PollutionDto {
  @ApiProperty({ example: '2023-10-25T12:00:00.000Z' })
  timestamp: Date;

  @ApiProperty({ example: 42, description: 'US Air Quality Index' })
  aqius: number;

  @ApiProperty({ example: 'p2', description: 'Main pollutant for US AQI' })
  mainus: string;

  @ApiProperty({ example: 14, description: 'China Air Quality Index' })
  aqicn: number;

  @ApiProperty({ example: 'p2', description: 'Main pollutant for China AQI' })
  maincn: string;
}

export class WeatherDto {
  @ApiProperty({ example: '2023-10-25T12:00:00.000Z' })
  timestamp: Date;

  @ApiProperty({ example: 15, description: 'Temperature in Celsius' })
  temperature: number;

  @ApiProperty({ example: 1012, description: 'Atmospheric pressure in hPa' })
  pressure: number;

  @ApiProperty({ example: 65, description: 'Humidity percentage' })
  humidity: number;

  @ApiProperty({ example: 3.1, description: 'Wind speed in m/s' })
  windSpeed: number;

  @ApiProperty({ example: 270, description: 'Wind direction in degrees' })
  windDirection: number;
}

export class AirQualityDataDto {
  @ApiProperty({ example: 'Paris' })
  city: string;

  @ApiProperty({ example: 'Ile-de-France' })
  state: string;

  @ApiProperty({ example: 'France' })
  country: string;

  @ApiProperty()
  location: LocationDto;

  @ApiProperty()
  pollution: PollutionDto;

  @ApiProperty()
  weather: WeatherDto;

  @ApiProperty({ example: '2023-10-25T12:00:00.000Z' })
  createdAt: Date;
}

export class AirQualityResponseDto {
  @ApiProperty({
    example: {
      city: 'Paris',
      state: 'Ile-de-France',
      country: 'France',
      location: { latitude: 48.856613, longitude: 2.352222 },
      pollution: { 
        timestamp: '2023-10-25T12:00:00.000Z',
        aqius: 42,
        mainus: 'p2',
        aqicn: 14,
        maincn: 'p2'
      },
      weather: {
        timestamp: '2023-10-25T12:00:00.000Z',
        temperature: 15,
        pressure: 1012,
        humidity: 65,
        windSpeed: 3.1,
        windDirection: 270
      },
      createdAt: '2023-10-25T12:00:00.000Z'
    }
  })
  Result: AirQualityDataDto;
}

export class MostPollutedDataDto {
  @ApiProperty({ example: '2023-10-25T12:00:00.000Z' })
  datetime: Date;

  @ApiProperty({ example: 42, description: 'US Air Quality Index' })
  aqius: number;

  @ApiProperty({ example: 'Paris' })
  city: string;
}

export class MostPollutedResponseDto {
  @ApiProperty({
    example: {
      datetime: '2023-10-25T12:00:00.000Z',
      aqius: 42,
      city: 'Paris'
    }
  })
  Result: MostPollutedDataDto;
}

export class NoDataResponseDto {
  @ApiProperty({
    example: {}
  })
  Result: Record<string, never>;
}