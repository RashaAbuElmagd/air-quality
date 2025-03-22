export class Location {
  constructor(
    public readonly latitude: number,
    public readonly longitude: number,
  ) {}

  equals(other: Location): boolean {
    return this.latitude === other.latitude && this.longitude === other.longitude;
  }

  toString(): string {
    return `${this.latitude},${this.longitude}`;
  }
} 