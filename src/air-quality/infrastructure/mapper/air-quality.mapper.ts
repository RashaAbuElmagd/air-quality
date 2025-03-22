import { Injectable } from '@nestjs/common';
import { AirQuality, Pollution, Weather } from '../../domain/model/air-quality.model';
import { Location } from '../../domain/valueobject/location.vo';
import { AirQualityResponseDto } from '../../api/dto/air-quality-response.dto';
import { AirQuality as PrismaAirQuality, Prisma } from '@prisma/client';

@Injectable()
export class AirQualityMapper {
  toDomain(prismaAirQuality: PrismaAirQuality): AirQuality {
    const location = prismaAirQuality.location as any;
    const pollution = prismaAirQuality.pollution as any;
    const weather = prismaAirQuality.weather as any;

    return new AirQuality(
      prismaAirQuality.id,
      prismaAirQuality.city,
      prismaAirQuality.state,
      prismaAirQuality.country,
      new Location(location.latitude, location.longitude),
      new Pollution(
        new Date(pollution.timestamp),
        pollution.aqius,
        pollution.mainus,
        pollution.aqicn,
        pollution.maincn,
      ),
      new Weather(
        new Date(weather.timestamp),
        weather.temperature,
        weather.pressure,
        weather.humidity,
        weather.windSpeed,
        weather.windDirection,
      ),
      prismaAirQuality.createdAt,
    );
  }

  toEntity(domain: AirQuality): Prisma.AirQualityCreateInput {
    return {
      city: domain.city,
      state: domain.state,
      country: domain.country,
      location: {
        latitude: domain.location.latitude,
        longitude: domain.location.longitude,
      },
      pollution: {
        timestamp: domain.pollution.timestamp.toISOString(),
        aqius: domain.pollution.aqius,
        mainus: domain.pollution.mainus,
        aqicn: domain.pollution.aqicn,
        maincn: domain.pollution.maincn,
      },
      weather: {
        timestamp: domain.weather.timestamp.toISOString(),
        temperature: domain.weather.temperature,
        pressure: domain.weather.pressure,
        humidity: domain.weather.humidity,
        windSpeed: domain.weather.windSpeed,
        windDirection: domain.weather.windDirection,
      },
    };
  }

  toResponseDto(entity: AirQuality): AirQualityResponseDto {
    return {
      Result: {
        city: entity.city,
        state: entity.state,
        country: entity.country,
        location: {
          latitude: entity.location.latitude,
          longitude: entity.location.longitude,
        },
        pollution: {
          timestamp: entity.pollution.timestamp,
          aqius: entity.pollution.aqius,
          mainus: entity.pollution.mainus,
          aqicn: entity.pollution.aqicn,
          maincn: entity.pollution.maincn,
        },
        weather: {
          timestamp: entity.weather.timestamp,
          temperature: entity.weather.temperature,
          pressure: entity.weather.pressure,
          humidity: entity.weather.humidity,
          windSpeed: entity.weather.windSpeed,
          windDirection: entity.weather.windDirection,
        },
        createdAt: entity.createdAt,
      }
    }
  } 
}