# Testing Guide

This document provides guidelines on testing the Air Quality Monitoring API.

## Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:cov

# Run tests in watch mode (useful during development)
npm run test:watch

# Run only end-to-end tests
npm run test:e2e
```

## Test Structure

Tests are organized following the same structure as the application code:

```
test/
├── unit/                           # Unit tests
│   └── air-quality/
│       ├── application/            # Tests for use cases
│       │   └── usecase/
│       │       ├── fetch-air-quality.usecase.spec.ts
│       │       ├── save-air-quality.usecase.spec.ts
│       │       └── get-most-polluted.usecase.spec.ts
│       ├── infrastructure/         # Tests for infrastructure components
│       │   ├── acl/
│       │   │   └── iqair-api.client.spec.ts
│       │   ├── repository/
│       │   │   └── air-quality.repository.spec.ts
│       │   └── scheduler/
│       │       └── cron.service.spec.ts
└── integration/                    # Integration tests
    └── air-quality.controller.spec.ts
```

## Writing Tests

### Unit Tests

Unit tests focus on testing individual components in isolation. We use Jest's mocking capabilities to replace dependencies.

Example of a use case test:

```typescript
describe('FetchAirQualityUseCase', () => {
  let useCase: FetchAirQualityUseCase;
  let iqairApiClient: jest.Mocked<IQAirApiClient>;

  beforeEach(() => {
    iqairApiClient = {
      getAirQuality: jest.fn(),
    } as any;
    
    useCase = new FetchAirQualityUseCase(iqairApiClient);
  });

  it('should fetch air quality data successfully', async () => {
    // Arrange
    const location = new Location(48.856613, 2.352222);
    const mockAirQuality = createMockAirQuality();
    iqairApiClient.getAirQuality.mockResolvedValue(mockAirQuality);
    
    // Act
    const result = await useCase.execute(location);
    
    // Assert
    expect(result).toEqual(mockAirQuality);
    expect(iqairApiClient.getAirQuality).toHaveBeenCalledWith(location);
  });
});
```

### Integration Tests

Integration tests verify that different components work together correctly. For API endpoints, we use the `@nestjs/testing` package to create a test module.

Example of a controller test:

```typescript
describe('AirQualityController', () => {
  let controller: AirQualityController;
  let fetchAirQualityUseCase: jest.Mocked<FetchAirQualityUseCase>;
  let getMostPollutedUseCase: jest.Mocked<GetMostPollutedUseCase>;

  beforeEach(async () => {
    fetchAirQualityUseCase = {
      execute: jest.fn(),
    } as any;
    
    getMostPollutedUseCase = {
      execute: jest.fn(),
    } as any;

    const module = await Test.createTestingModule({
      controllers: [AirQualityController],
      providers: [
        { provide: FetchAirQualityUseCase, useValue: fetchAirQualityUseCase },
        { provide: GetMostPollutedUseCase, useValue: getMostPollutedUseCase },
      ],
    }).compile();

    controller = module.get<AirQualityController>(AirQualityController);
  });

  it('should fetch air quality for nearest city', async () => {
    // Arrange
    const dto = { latitude: 48.856613, longitude: 2.352222 };
    const mockAirQuality = createMockAirQuality();
    fetchAirQualityUseCase.execute.mockResolvedValue(mockAirQuality);
    
    // Act
    const result = await controller.getNearestCity(dto);
    
    // Assert
    expect(result).toMatchObject({
      result: {
        city: mockAirQuality.city,
        state: mockAirQuality.state,
        country: mockAirQuality.country,
        // Additional assertions...
      }
    });
  });
});
```

## Test Helpers

We use helper functions to create mock objects for testing:

```typescript
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
```

## Environment Setup for Testing

Tests use a separate environment configuration. Create a `.env.test` file with testing-specific variables:

```
# .env.test
NODE_ENV=test
IQAIR_API_KEY=test_api_key
IQAIR_API_BASE_URL=https://api.airvisual.com/v2
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/air_quality_test
```

## Best Practices

1. **Test Isolation**: Each test should be independent and not rely on the state from previous tests.

2. **Descriptive Test Names**: Use descriptive test names that explain what's being tested and the expected outcome.

3. **AAA Pattern**: Structure tests using the Arrange-Act-Assert pattern for clarity.

4. **Mock External Dependencies**: Always mock external services, databases, and APIs.

5. **Test Edge Cases**: Include tests for error conditions, empty inputs, and boundary values.

6. **Coverage**: Aim for high test coverage, especially for critical business logic.

7. **Keep Tests Fast**: Tests should execute quickly to maintain a smooth development workflow.

## Troubleshooting

### Common Issues

1. **Database Connection Errors**: Ensure the test database exists and is configured correctly.

2. **Missing Environment Variables**: Check that all required environment variables are set in your `.env.test` file.

3. **Jest Configuration Issues**: If tests aren't being found, check the `testRegex` and `roots` in the Jest configuration.

### Debugging Tests

To debug tests, use the test:debug script:

```bash
npm run test:debug
```

Then connect with a debugger (e.g., in VS Code or Chrome DevTools). 