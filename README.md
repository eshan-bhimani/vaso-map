# VasoMap - Vascular System Explorer

VasoMap is a Google Maps-style web application for exploring the human vascular system. The MVP focuses on coronary arteries with plans to expand to the complete cardiovascular system.


## Features

- **Interactive Graph Visualization**: Force-directed graph using D3.js showing vessels and connections
- **Search Functionality**: Search vessels by name or alias (e.g., "LAD", "coronary")
- **Vessel Details**: View comprehensive information including clinical notes and diameter ranges
- **Pathfinding**: Find shortest paths between any two vessels
- **Neighbor Navigation**: Explore upstream and downstream vessel connections
- **Educational Content**: Clinical notes and anatomical descriptions for learning

## Tech Stack

### Backend
- **Java 21** with **Spring Boot 3.2.0**
- **PostgreSQL 15** database
- **Flyway** for database migrations
- **Spring Data JPA** / Hibernate for ORM
- **SpringDoc OpenAPI** for API documentation
- **Maven** for build management

### Frontend
- **React 18** with **TypeScript**
- **Vite** for fast builds and HMR
- **Tailwind CSS** for styling
- **D3.js** for force-directed graph visualization
- **Zustand** for state management

## Prerequisites

- **Java 21** or higher
- **Node.js 18** or higher
- **Docker** and **Docker Compose** (for database)
- **Maven 3.9** or higher

## Quick Start

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/yourusername/vasomap.git
cd vasomap
\`\`\`

### 2. Start the Database

\`\`\`bash
docker-compose up -d
\`\`\`

This starts a PostgreSQL container on port 5432. The database will be automatically created with the schema and seed data.

### 3. Start the Backend

\`\`\`bash
cd backend
mvn spring-boot:run
\`\`\`

The backend API will be available at [http://localhost:8080](http://localhost:8080)

Swagger UI documentation: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

### 4. Start the Frontend

\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

The frontend will be available at [http://localhost:5173](http://localhost:5173)

## Project Structure

\`\`\`
vasomap/
├── backend/              # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/vasomap/
│   │   │   │   ├── entity/       # JPA entities
│   │   │   │   ├── repository/   # Data access layer
│   │   │   │   ├── dto/          # Data transfer objects
│   │   │   │   ├── service/      # Business logic
│   │   │   │   ├── controller/   # REST endpoints
│   │   │   │   ├── config/       # Configuration classes
│   │   │   │   └── exception/    # Error handling
│   │   │   └── resources/
│   │   │       ├── db/migration/ # Flyway SQL migrations
│   │   │       └── application.yml
│   │   └── test/         # Unit and integration tests
│   └── pom.xml
│
├── frontend/             # React TypeScript frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   │   ├── MapView/      # D3 graph visualization
│   │   │   ├── SearchPanel/  # Search functionality
│   │   │   ├── InfoPanel/    # Vessel details
│   │   │   ├── PathPanel/    # Pathfinding
│   │   │   └── ui/           # Reusable UI components
│   │   ├── store/        # Zustand state management
│   │   ├── services/     # API client
│   │   ├── types/        # TypeScript types
│   │   ├── utils/        # Utility functions
│   │   └── styles/       # Global CSS
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
└── docker-compose.yml    # PostgreSQL container
\`\`\`

## API Endpoints

### Vessels

- `GET /api/v1/vessels` - Get all vessels (optional `?query=` parameter for search)
- `GET /api/v1/vessels/{id}` - Get vessel details by ID

### Pathfinding

- `POST /api/v1/paths` - Find shortest path between vessels

### Regions

- `GET /api/v1/regions` - Get anatomical regions (hierarchical tree)

## Development

### Running Backend Tests

\`\`\`bash
cd backend
mvn test
\`\`\`

The test suite includes:
- Unit tests with Mockito
- Integration tests with Testcontainers

### Running Frontend Tests

\`\`\`bash
cd frontend
npm test
\`\`\`

### Building for Production

**Backend:**
\`\`\`bash
cd backend
mvn clean package
java -jar target/vasomap-backend-0.0.1-SNAPSHOT.jar
\`\`\`

**Frontend:**
\`\`\`bash
cd frontend
npm run build
# Serve the dist/ directory with a static file server
\`\`\`

## Database Schema

The database uses PostgreSQL with the following main tables:

- **vessels** - Blood vessel entities
- **vessel_edges** - Directed connections between vessels
- **regions** - Anatomical regions (hierarchical)
- **aliases** - Alternative names for vessels
- **notes** - Educational content in Markdown

See `backend/src/main/resources/db/migration/` for complete schema definitions.

## Seed Data

The MVP includes 15 coronary vessels:
- Ascending Aorta (root)
- Left Coronary Artery (LCA)
  - Left Anterior Descending (LAD) with diagonal and septal branches
  - Left Circumflex (LCx) with obtuse marginal branches
- Right Coronary Artery (RCA)
  - Acute marginal, PDA, and posterolateral branches

## Educational Resources

See [LEARNING.md](LEARNING.md) for:
- Architecture deep-dive
- Key concepts explained
- Learning path for contributors
- Tutorials and guides

## API Documentation

See [API.md](API.md) for:
- Complete API reference
- Request/response examples
- Error handling
- Authentication (future)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Coronary anatomy based on standard medical texts
- Built with modern open-source technologies
- Inspired by Google Maps' intuitive navigation

## Roadmap

- [ ] Complete coronary venous system
- [ ] Full body arterial tree
- [ ] 3D visualization with Three.js
- [ ] Quiz mode for medical students
- [ ] User annotations and bookmarks
- [ ] Mobile responsive design
- [ ] AWS deployment with Terraform

---

**Built for medical education!**
