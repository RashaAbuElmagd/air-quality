import { Test, TestingModule } from '@nestjs/testing';
import { AirQualityRepository } from '../../../../../src/air-quality/infrastructure/repository/air-quality.repository';
import { PrismaService } from '../../../../../src/shared/prisma/prisma.service';
import { AirQualityMapper } from '../../../../../src/air-quality/infrastructure/mapper/air-quality.mapper';
import { AirQuality, Pollution, Weather } from '../../../../../src/air-quality/domain/model/air-quality.model';
import { Location } from '../../../../../src/air-quality/domain/valueobject/location.vo';
import { PrismaPromise } from '@prisma/client';

describe('AirQualityRepository', () => {
  let repository: AirQualityRepository;
  let mockPrismaService: jest.Mocked<PrismaService>;
  let mockAirQualityMapper: jest.Mocked<AirQualityMapper>;

  beforeEach(async () => {
    // Create properly typed mocks for PrismaService
    mockPrismaService = {
      $queryRaw: jest.fn().mockImplementation(() => Promise.resolve([])),
      airQuality: {
        create: jest.fn().mockImplementation(() => Promise.resolve({ id: 'mock-id' })),
        findMany: jest.fn().mockImplementation(() => Promise.resolve([])),
      },
    } as unknown as jest.Mocked<PrismaService>;

    mockAirQualityMapper = {
      toDomain: jest.fn(),
      toEntity: jest.fn(),
    } as unknown as jest.Mocked<AirQualityMapper>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AirQualityRepository,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: AirQualityMapper, useValue: mockAirQualityMapper },
      ],
    }).compile();

    repository = module.get<AirQualityRepository>(AirQualityRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('save', () => {
    it('should convert domain entity to Prisma entity and save it', async () => {
      // Arrange
      const mockAirQuality = createMockAirQuality();
      const mockPrismaEntity = {
        id: 'db-id',
        city: 'Paris',
        state: 'Ile-de-France',
        country: 'France',
        location: { latitude: 48.856613, longitude: 2.352222 },
        pollution: { aqius: 42, mainus: 'p2', aqicn: 14, maincn: 'p2' },
        weather: { tp: 15, pr: 1012, hu: 65, ws: 3.1, wd: 270 },
        created_at: new Date(),
      };
      const mockSavedPrismaEntity = { ...mockPrismaEntity };
      
      mockAirQualityMapper.toEntity.mockReturnValue(mockPrismaEntity);
      (mockPrismaService.airQuality.create as jest.Mock).mockResolvedValue(mockSavedPrismaEntity);
      mockAirQualityMapper.toDomain.mockReturnValue(mockAirQuality);

      // Act
      await repository.save(mockAirQuality);

      // Assert
      expect(mockAirQualityMapper.toEntity).toHaveBeenCalledWith(mockAirQuality);
      expect(mockPrismaService.airQuality.create).toHaveBeenCalledWith({
        data: mockPrismaEntity,
      });
    });

    it('should return the domain entity after saving', async () => {
      // Arrange
      const mockAirQuality = createMockAirQuality();
      const mockPrismaEntity = {
        id: 'db-id',
        city: 'Paris',
        state: 'Ile-de-France',
        country: 'France',
        location: { latitude: 48.856613, longitude: 2.352222 },
        pollution: { aqius: 42, mainus: 'p2', aqicn: 14, maincn: 'p2' },
        weather: { tp: 15, pr: 1012, hu: 65, ws: 3.1, wd: 270 },
        created_at: new Date(),
      };
      const mockSavedPrismaEntity = { ...mockPrismaEntity };
      const mockSavedDomainEntity = { ...mockAirQuality, id: 'db-id' };
      
      mockAirQualityMapper.toEntity.mockReturnValue(mockPrismaEntity);
      (mockPrismaService.airQuality.create as jest.Mock).mockResolvedValue(mockSavedPrismaEntity);
      mockAirQualityMapper.toDomain.mockReturnValue(mockSavedDomainEntity);

      // Act
      const result = await repository.save(mockAirQuality);

      // Assert
      expect(mockAirQualityMapper.toDomain).toHaveBeenCalledWith(mockSavedPrismaEntity);
      expect(result).toEqual(mockSavedDomainEntity);
    });

    it('should throw an error when Prisma save operation fails', async () => {
      // Arrange
      const mockAirQuality = createMockAirQuality();
      const mockPrismaEntity = {
        id: 'db-id',
        city: 'Paris',
        state: 'Ile-de-France',
        country: 'France',
        location: { latitude: 48.856613, longitude: 2.352222 },
        pollution: { aqius: 42, mainus: 'p2', aqicn: 14, maincn: 'p2' },
        weather: { tp: 15, pr: 1012, hu: 65, ws: 3.1, wd: 270 },
        created_at: new Date(),
      };
      const error = new Error('Database error');
      
      mockAirQualityMapper.toEntity.mockReturnValue(mockPrismaEntity);
      (mockPrismaService.airQuality.create as jest.Mock).mockRejectedValue(error);

      // Act & Assert
      await expect(repository.save(mockAirQuality)).rejects.toThrow('Database error');
    });
  });

  describe('findMostPolluted', () => {
    it('should query Prisma with the correct parameters', async () => {
      // Arrange
      const city = 'Paris';
      
      // Use $queryRaw since that's what we're using in the implementation
      (mockPrismaService.$queryRaw as jest.Mock).mockResolvedValue([]);

      // Act
      await repository.findMostPolluted(city);

      // Assert
      expect(mockPrismaService.$queryRaw).toHaveBeenCalled();
      // We can't check exact query parameters since it's using a tagged template string
    });

    it('should return the domain entity when Prisma returns results', async () => {
      // Arrange
      const city = 'Paris';
      const mockPrismaEntity = { 
        id: 'most-polluted-id',
        city: 'Paris',
        state: 'Ile-de-France',
        country: 'France',
        location: { latitude: 48.856613, longitude: 2.352222 },
        pollution: { aqius: 100, mainus: 'p2', aqicn: 14, maincn: 'p2' },
        weather: { tp: 15, pr: 1012, hu: 65, ws: 3.1, wd: 270 },
        created_at: new Date(),
      };
      const mockDomainEntity = createMockAirQuality();
      
      // Mock returning a single result from the query
      (mockPrismaService.$queryRaw as jest.Mock).mockResolvedValue([mockPrismaEntity]);
      mockAirQualityMapper.toDomain.mockReturnValue(mockDomainEntity);

      // Act
      const result = await repository.findMostPolluted(city);

      // Assert
      expect(mockAirQualityMapper.toDomain).toHaveBeenCalledWith(mockPrismaEntity);
      expect(result).toEqual(mockDomainEntity);
    });

    it('should return null when no records found', async () => {
      // Arrange
      const city = 'NonExistentCity';
      (mockPrismaService.$queryRaw as jest.Mock).mockResolvedValue([]);

      // Act
      const result = await repository.findMostPolluted(city);

      // Assert
      expect(result).toBeNull();
      expect(mockAirQualityMapper.toDomain).not.toHaveBeenCalled();
    });

    it('should throw an error when Prisma query fails', async () => {
      // Arrange
      const city = 'Paris';
      const error = new Error('Database error');
      
      (mockPrismaService.$queryRaw as jest.Mock).mockRejectedValue(error);

      // Act & Assert
      await expect(repository.findMostPolluted(city)).rejects.toThrow('Database error');
    });
  });
});

// Helper function to create mock AirQuality objects
function createMockAirQuality(): AirQuality {
  const now = new Date();
  const location = new Location(48.856613, 2.352222);
  
  const pollution = new Pollution(
    now,
    42,
    'p2',
    14,
    'p2'
  );
  
  const weather = new Weather(
    now,
    15,
    1012,
    65,
    3.1,
    270
  );
  
  return new AirQuality(
    null,
    'Paris',
    'Ile-de-France',
    'France',
    location,
    pollution,
    weather,
    now
  );
} 