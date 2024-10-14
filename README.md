# Expressify-ts

This is a robust starter boilerplate for building Express applications with TypeScript. It follows a modular monolith architecture and comes pre-configured with Docker, MongoDB, Mongoose, Zod for request validation, robust error handling, and an ELK stack for logging.

## Features

- **TypeScript**: Fully configured for TypeScript development
- **Express**: Fast, unopinionated, minimalist web framework for Node.js
- **Modular Monolith Architecture**: Organized, scalable project structure
- **Docker**: Containerization for easy deployment and development
- **MongoDB & Mongoose**: Database setup and ORM
- **Zod**: Runtime type checking and request validation
- **Robust Error Handling**: Centralized error handling for consistency
- **ELK Stack**: Elasticsearch, Logstash, and Kibana for powerful logging
- **Live Reload**: Automatic server restart on file changes during development

## Prerequisites

- Node.js (latest LTS version recommended)
- Package manager (yarn recommended)
- Docker and Docker Compose

## Quick Start

1. Clone the repository:

   ```
   git clone https://github.com/faiyaz032/expressify-ts
   cd expressify-ts
   ```

2. Install dependencies:

   ```
   yarn install
   ```

3. Start the development environment:
   ```
   yarn docker:dev
   ```

This command will start all services, including the Express app, MongoDB, and the ELK stack, using Docker Compose.

## Project Structure

```
expressify-ts/
├── logs/
├── logstash/
├── node_modules/
├── src/
    ├── app/
│   ├── modules/ -- Define app services here
        └── index.ts -- file to register all services
│   ├── middlewares/
│   ├── shared/
│       └── database/
│       └── error-handling/
│       └── logger/
│       └── utils/
├── .env.development
├── .env.production
├── .gitignore
├── docker-compose.dev.yml
├── docker-compose.prod.yml
├── Dockerfile.dev
├── Dockerfile.prod
├── package.json
├── prettier.yml
├── README.md
├── tsconfig.json
└── yarn.lock
```

## Architecture

This boilerplate follows a modular monolith architecture:

- `modules/`: Contains feature-specific modules, each potentially having its own routes, controllers, services, and models
- `middlewares/`: Custom middleware functions
- `utils/`: Shared utility functions
- `types/`: TypeScript type definitions

## Configuration

- Environment variables are stored in `.env.development` and `.env.production` files.
- TypeScript configuration is in `tsconfig.json`.
- Docker configurations are in `Dockerfile.dev`, `Dockerfile.prod`, `docker-compose.dev.yml`, and `docker-compose.prod.yml`.

## Scripts

- `yarn docker:dev`: Start the development environment with Docker
- `yarn docker:prod`: Start the production environment with Docker
- `yarn dev`: Start the development server without Docker
- `yarn build`: Build the TypeScript project
- `yarn start`: Start the production server without Docker

## Logging

This boilerplate uses the ELK (Elasticsearch, Logstash, Kibana) stack for logging:

- Logs are collected and processed by Logstash
- Stored in Elasticsearch
- Visualized through Kibana

Access Kibana at `http://localhost:5601` when running in development mode.

## Database

MongoDB is used as the database, with Mongoose as the ODM (Object Document Mapper). Connection settings can be configured in the environment files.

## Request Validation

Zod is set up for runtime type checking and request validation. Define your schemas in the appropriate module and use them in your route handlers for consistent and type-safe request validation.

## Error Handling

The boilerplate includes a robust, centralized error handling system. Custom error classes and a global error handling middleware ensure consistent error responses across the application.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License
