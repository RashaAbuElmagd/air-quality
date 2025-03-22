import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of, throwError } from 'rxjs';
import { IQAirApiClient } from '../../../../../src/air-quality/infrastructure/acl/iqair-api.client';
import { Location } from '../../../../../src/air-quality/domain/valueobject/location.vo';
import { AirQuality } from '../../../../../src/air-quality/domain/model/air-quality.model';
import { AxiosResponse } from 'axios';

describe('IQAirApiClient', () => {
  let client: IQAirApiClient;
  let mockHttpService: jest.Mocked<HttpService>;
  let mockConfigService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    mockHttpService = {
      get: jest.fn(),
    } as unknown as jest.Mocked<HttpService>;

    mockConfigService = {
      get: jest.fn(),
    } as unknown as jest.Mocked<ConfigService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IQAirApiClient,
        { provide: HttpService, useValue: mockHttpService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    client = module.get<IQAirApiClient>(IQAirApiClient);
    
    // Mock the API key
    mockConfigService.get.mockReturnValue('test-api-key');
  });

  it('should be defined', () => {
    expect(client).toBeDefined();
  });

  describe('fetchAirQuality', () => {
    it('should call the IQAir API with correct parameters', async () => {
      // Arrange
      const location = new Location(48.856613, 2.352222);
      const mockResponse: AxiosResponse = {
        data: {
          status: 'success',
          data: {
            city: 'Paris',
            state: 'Ile-de-France',
            country: 'France',
            current: {
              pollution: {
                ts: '2023-01-01T12:00:00.000Z',
                aqius: 42,
                mainus: 'p2',
                aqicn: 14,
                maincn: 'p2',
              },
              weather: {
                ts: '2023-01-01T12:00:00.000Z',
                tp: 15,
                pr: 1012,
                hu: 65,
                ws: 3.1,
                wd: 270,
              },
            },
          },
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: {} } as any
      };

      mockHttpService.get.mockReturnValue(of(mockResponse));

      // Act
      await client.fetchAirQuality(location);

      // Assert
      expect(mockHttpService.get).toHaveBeenCalledWith(
        'http://api.airvisual.com/v2/nearest_city',
        {
          params: {
            lat: location.latitude,
            lon: location.longitude,
            key: '',
          },
        },
      );
    });

    it('should transform API response to AirQuality domain model', async () => {
      // Arrange
      const location = new Location(48.856613, 2.352222);
      const mockApiResponse: AxiosResponse = {
        data: {
          status: 'success',
          data: {
            city: 'Paris',
            state: 'Ile-de-France',
            country: 'France',
            current: {
              pollution: {
                ts: '2023-01-01T12:00:00.000Z',
                aqius: 42,
                mainus: 'p2',
                aqicn: 14,
                maincn: 'p2',
              },
              weather: {
                ts: '2023-01-01T12:00:00.000Z',
                tp: 15,
                pr: 1012,
                hu: 65,
                ws: 3.1,
                wd: 270,
              },
            },
          },
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: {} } as any
      };

      mockHttpService.get.mockReturnValue(of(mockApiResponse));

      // Act
      const result = await client.fetchAirQuality(location);

      // Assert
      expect(result).toBeInstanceOf(AirQuality);
      expect(result.city).toBe('Paris');
      expect(result.state).toBe('Ile-de-France');
      expect(result.country).toBe('France');
      expect(result.location).toBe(location);
      expect(result.pollution.aqius).toBe(42);
      expect(result.pollution.mainus).toBe('p2');
      expect(result.weather.temperature).toBe(15);
      expect(result.weather.pressure).toBe(1012);
    });

    it('should throw an error when API returns non-success status', async () => {
      // Arrange
      const location = new Location(48.856613, 2.352222);
      const mockErrorResponse: AxiosResponse = {
        data: {
          status: 'fail',
          data: {
            message: 'Invalid API key',
          },
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: {} } as any
      };

      mockHttpService.get.mockReturnValue(of(mockErrorResponse));

      // Act & Assert
      await expect(client.fetchAirQuality(location)).rejects.toThrow(
        'Failed to get air quality data: fail',
      );
    });

    it('should throw an error when HTTP request fails', async () => {
      // Arrange
      const location = new Location(48.856613, 2.352222);
      const error = new Error('Network error');

      mockHttpService.get.mockReturnValue(throwError(() => error));

      // Act & Assert
      await expect(client.fetchAirQuality(location)).rejects.toThrow('Network error');
    });
  });
}); 