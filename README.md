# Air Quality Monitoring API

## Project Overview

This project is a NestJS-based API that monitors air quality data from IQAir. It collects air quality information for Paris every minute and provides endpoints to retrieve the current air quality for any location and to find the most polluted time recorded for Paris.

## Features

- Fetch air quality data for any location by coordinates
- Automatically collect air quality data for Paris every minute
- Retrieve the most polluted time recorded for Paris
- Swagger API documentation

## Technology Stack

- **Backend Framework**: NestJS
- **Database**: PostgreSQL with Prisma ORM
- **Scheduling**: NestJS Schedule module
- **API Documentation**: Swagger
- **Containerization**: Docker
- **External API**: IQAir API
- **Testing**: Jest for unit and integration tests

## Domain-Driven Design (DDD) Architecture

This project follows Domain-Driven Design principles to create a maintainable and scalable application. The architecture is organized into the following layers:

### 1. Domain Layer

The core of the application containing business logic and rules.

- **Models**: Core business objects like `AirQuality`, `Pollution`, and `Weather`
- **Value Objects**: Immutable objects like `Location` that encapsulate domain concepts
- **Domain Services**: Operations that don't naturally belong to entities

```
src/air-quality/domain/
├── model/
│   └── air-quality.model.ts
└── valueobject/
    └── location.vo.ts
```

### 2. Application Layer

Orchestrates the domain objects to perform specific use cases.

- **Use Cases**: Specific operations like fetching air quality, saving data, and finding the most polluted time
- **Ports**: Interfaces that define how the application interacts with external systems

```
src/air-quality/application/
├── port/
│   ├── air-quality-repository.port.ts
│   └── iqair-api.port.ts
└── usecase/
    ├── fetch-air-quality.usecase.ts
    ├── save-air-quality.usecase.ts
    └── get-most-polluted.usecase.ts
```

### 3. Infrastructure Layer

Provides technical capabilities to support the application.

- **Repositories**: Implementations of domain repository interfaces
- **ACL (Anti-Corruption Layer)**: Adapters for external services like IQAir API
- **Scheduler**: CRON job for collecting air quality data
- **Mappers**: Convert between domain models and DTOs/database entities

```
src/air-quality/infrastructure/
├── acl/
│   └── iqair-api.client.ts
├── mapper/
│   └── air-quality.mapper.ts
├── repository/
│   └── air-quality.repository.ts
└── scheduler/
    └── cron.service.ts
```

### 4. API Layer

Handles HTTP requests and exposes the application to the outside world.

- **Controllers**: Handle HTTP requests and responses
- **DTOs**: Data Transfer Objects for input/output validation and documentation

```
src/air-quality/api/
├── controller/
│   └── air-quality.controller.ts
└── dto/
    ├── air-quality-response.dto.ts
    └── get-air-quality.dto.ts
```

## Key Design Decisions

1. **Hexagonal Architecture**: The application uses ports and adapters to decouple the domain from external concerns.

2. **Repository Pattern**: Data access is abstracted through repositories, allowing the domain to remain database-agnostic.

3. **CQRS-inspired Approach**: Separate use cases for commands (saving data) and queries (retrieving data).

4. **Value Objects**: Location is modeled as a value object to encapsulate validation and behavior.

5. **Dependency Inversion**: High-level modules don't depend on low-level modules; both depend on abstractions.

## API Endpoints

- `GET /air-quality/nearest-city?latitude=48.856613&longitude=2.352222`: Get air quality for the nearest city to the provided coordinates
- `GET /air-quality/most-polluted`: Get the most polluted time recorded for Paris

## Setup and Installation

### Prerequisites

- Docker and Docker Compose
- Node.js (for local development)

### Running with Docker

1. Clone the repository
2. Create a `.env` file with your IQAir API key
3. Run `docker-compose up -d`
4. Access the API at http://localhost:3000
5. Access Swagger documentation at http://localhost:3000/api

### Local Development

1. Clone the repository
2. Install dependencies: `npm install --legacy-peer-deps`
3. Set up environment variables
4. Generate Prisma client: `npx prisma generate`
5. Run migrations: `npx prisma migrate dev`
6. Start the application: `npm run start:dev`

## Database Schema

The application uses a PostgreSQL database with the following schema:

```prisma
model AirQuality {
  id        String   @id @default(uuid())
  city      String
  state     String
  country   String
  location  Json     // Stores latitude and longitude
  pollution Json     // Stores pollution metrics
  weather   Json     // Stores weather metrics
  createdAt DateTime @default(now()) @map("created_at")

  @@index([city])
  @@map("air_quality")
}
```

## CRON Job

The application includes a scheduled task that runs every minute to collect air quality data for Paris:

```typescript
@Cron('* * * * *') // Every minute
async checkParisAirQuality() {
  // Fetch and save air quality data for Paris
}
```

## Testing

The project includes comprehensive unit and integration tests covering all layers of the application:

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:cov

# Run tests in watch mode
npm run test:watch
```

### Test Structure

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

## Future Enhancements

- Add authentication and authorization
- Implement caching for frequently accessed data
- Add more analytics endpoints
- Support for multiple cities
- Historical data visualization

## License

This project is licensed under the MIT License - see the LICENSE file for details.