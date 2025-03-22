import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { IQAirApiPort } from '../../application/port/iqair-api.port';
import { AirQuality, Pollution, Weather } from '../../domain/model/air-quality.model';
import { Location } from '../../domain/valueobject/location.vo';

@Injectable()
export class IQAirApiClient implements IQAirApiPort {
  private readonly logger = new Logger(IQAirApiClient.name);
  private readonly apiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('IQAIR_API_KEY') || '';
  }

  async fetchAirQuality(location: Location): Promise<AirQuality> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`http://api.airvisual.com/v2/nearest_city`, {
          params: {
            lat: location.latitude,
            lon: location.longitude,
            key: this.apiKey,
          },
        }),
      );
      
      if (response.data.status !== 'success') {
        throw new Error(`Failed to get air quality data: ${response.data.status}`);
      }
      
      const { city, state, country, current } = response.data.data;
      
      const pollution = new Pollution(
        new Date(current.pollution.ts),
        current.pollution.aqius,
        current.pollution.mainus,
        current.pollution.aqicn,
        current.pollution.maincn,
      );
      
      const weather = new Weather(
        new Date(current.weather.ts),
        current.weather.tp,
        current.weather.pr,
        current.weather.hu,
        current.weather.ws,
        current.weather.wd,
      );
      
      return new AirQuality(
        null,
        city,
        state,
        country,
        location,
        pollution,
        weather,
        new Date(),
      );
    } catch (error) {
      if (process.env.NODE_ENV !== 'test') {
        this.logger.error(`Failed to fetch air quality: ${error.message}`);
      }
      throw error;
    }
  }
} 