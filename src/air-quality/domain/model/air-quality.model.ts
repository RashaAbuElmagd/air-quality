import { Location } from '../valueobject/location.vo';

export class Pollution {
  constructor(
    public readonly timestamp: Date,
    public readonly aqius: number,
    public readonly mainus: string,
    public readonly aqicn: number,
    public readonly maincn: string,
  ) {}
}

export class Weather {
  constructor(
    public readonly timestamp: Date,
    public readonly temperature: number,
    public readonly pressure: number,
    public readonly humidity: number,
    public readonly windSpeed: number,
    public readonly windDirection: number,
  ) {}
}

export class AirQuality {
  constructor(
    public readonly id: string | null = null,
    public readonly city: string,
    public readonly state: string,
    public readonly country: string,
    public readonly location: Location,
    public readonly pollution: Pollution,
    public readonly weather: Weather,
    public readonly createdAt: Date,
  ) {}
} 