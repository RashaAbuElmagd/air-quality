import { AirQuality } from '../src/air-quality/domain/model/air-quality.model';
import { Location } from '../src/air-quality/domain/valueobject/location.vo';

/**
 * Creates a mock AirQuality object for testing
 * @param overrides - Optional properties to override default values
 * @returns A mock AirQuality object
 */
export function createMockAirQuality(overrides = {}): AirQuality {
  return {
    id: 'mock-id',
    city: 'Paris',
    state: 'Ile-de-France',
    country: 'France',
    location: new Location(48.856613, 2.352222),
    pollution: {
      ts: new Date().toISOString(),
      aqius: 50,
      mainus: 'p2',
      aqicn: 21,
      maincn: 'p2',
    },
    weather: {
      ts: new Date().toISOString(),
      tp: 21,
      pr: 1012,
      hu: 65,
      ws: 3.1,
      wd: 90,
      ic: 'cloudy',
    },
    createdAt: new Date(),
    ...overrides,
  };
}

/**
 * Creates a mock IQAir API response for testing
 * @param overrides - Optional properties to override default values
 * @returns A mock IQAir API response
 */
export function createMockIQAirResponse(overrides = {}) {
  return {
    status: 'success',
    data: {
      city: 'Paris',
      state: 'Ile-de-France',
      country: 'France',
      location: {
        type: 'Point',
        coordinates: [2.352222, 48.856613],
      },
      current: {
        pollution: {
          ts: new Date().toISOString(),
          aqius: 50,
          mainus: 'p2',
          aqicn: 21,
          maincn: 'p2',
        },
        weather: {
          ts: new Date().toISOString(),
          tp: 21,
          pr: 1012,
          hu: 65,
          ws: 3.1,
          wd: 90,
          ic: 'cloudy',
        },
      },
      ...overrides,
    },
  };
}

/**
 * Creates a mock Location object for testing
 * @param latitude - Optional latitude (defaults to Paris latitude)
 * @param longitude - Optional longitude (defaults to Paris longitude)
 * @returns A mock Location object
 */
export function createMockLocation(
  latitude = 48.856613,
  longitude = 2.352222,
): Location {
  return new Location(latitude, longitude);
}

/**
 * Creates a mock database entity for testing
 * @param overrides - Optional properties to override default values
 * @returns A mock database entity
 */
export function createMockDatabaseEntity(overrides = {}) {
  const now = new Date();
  
  return {
    id: 'db-mock-id',
    city: 'Paris',
    state: 'Ile-de-France',
    country: 'France',
    location: { latitude: 48.856613, longitude: 2.352222 },
    pollution: {
      ts: now.toISOString(),
      aqius: 50,
      mainus: 'p2',
      aqicn: 21,
      maincn: 'p2',
    },
    weather: {
      ts: now.toISOString(),
      tp: 21,
      pr: 1012,
      hu: 65,
      ws: 3.1,
      wd: 90,
      ic: 'cloudy',
    },
    created_at: now,
    ...overrides,
  };
} 