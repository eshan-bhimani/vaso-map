# VasoMap Learning Guide

This document explains the architecture, design decisions, and key concepts in VasoMap. It's designed to help developers understand the codebase and learn full-stack development patterns.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Backend Deep Dive](#backend-deep-dive)
3. [Frontend Deep Dive](#frontend-deep-dive)
4. [Database Design](#database-design)
5. [Key Algorithms](#key-algorithms)
6. [Design Patterns](#design-patterns)
7. [Testing Strategy](#testing-strategy)

---

## Architecture Overview

VasoMap follows a standard three-tier architecture:

```
┌─────────────────────────────────────────────────┐
│                   Frontend                       │
│  React + TypeScript + D3.js + Tailwind CSS     │
│              (Port 5173)                        │
└────────────────┬────────────────────────────────┘
                 │ HTTP/JSON
                 │ REST API
┌────────────────┴────────────────────────────────┐
│                   Backend                        │
│        Spring Boot + Java 21                    │
│              (Port 8080)                        │
└────────────────┬────────────────────────────────┘
                 │ JDBC
                 │
┌────────────────┴────────────────────────────────┐
│                  Database                        │
│            PostgreSQL 15                        │
│              (Port 5432)                        │
└─────────────────────────────────────────────────┘
```

### Communication Flow

1. **User Interaction**: User clicks a vessel in the D3.js graph
2. **State Update**: Zustand store updates `selectedVessel`
3. **API Call**: Frontend makes `GET /api/v1/vessels/{id}`
4. **Controller**: Spring Boot controller receives request
5. **Service Layer**: Business logic processes request
6. **Repository**: JPA queries database
7. **Response**: JSON travels back through layers
8. **UI Update**: React re-renders with new data

---

## Backend Deep Dive

### Spring Boot Architecture

#### 1. Entity Layer

**Purpose**: Represent database tables as Java objects.

**Example**: [Vessel.java](backend/src/main/java/com/vasomap/entity/Vessel.java:1)

```java
@Entity
@Table(name = "vessels")
public class Vessel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "vessel")
    private List<Alias> aliases;

    // JPA manages object-relational mapping
}
```

**Key Concepts**:
- `@Entity`: Marks class as JPA entity
- `@OneToMany`: Defines relationship (one vessel, many aliases)
- Hibernate generates SQL from annotations

#### 2. Repository Layer

**Purpose**: Data access abstraction.

**Example**: [VesselRepository.java](backend/src/main/java/com/vasomap/repository/VesselRepository.java:1)

```java
public interface VesselRepository extends JpaRepository<Vessel, Long> {
    @Query("SELECT v FROM Vessel v WHERE LOWER(v.name) LIKE LOWER(:query)")
    List<Vessel> searchByNameOrAlias(@Param("query") String query);
}
```

**Key Concepts**:
- Spring Data JPA generates implementations automatically
- JPQL (Java Persistence Query Language) is database-agnostic
- Custom queries use `@Query` annotation

#### 3. Service Layer

**Purpose**: Business logic and transaction management.

**Example**: [VesselService.java](backend/src/main/java/com/vasomap/service/VesselService.java:1)

```java
@Service
@Transactional(readOnly = true)
public class VesselService {
    public VesselDetailDTO getVesselById(Long id) {
        Vessel vessel = repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("..."));
        return convertToDTO(vessel);
    }
}
```

**Key Concepts**:
- `@Transactional`: Ensures database consistency
- DTOs prevent exposing internal entities to API
- Exception handling provides clear error messages

#### 4. Controller Layer

**Purpose**: HTTP endpoint definitions.

**Example**: [VesselController.java](backend/src/main/java/com/vasomap/controller/VesselController.java:1)

```java
@RestController
@RequestMapping("/api/v1/vessels")
public class VesselController {
    @GetMapping("/{id}")
    public ResponseEntity<VesselDetailDTO> getVesselById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getVesselById(id));
    }
}
```

**Key Concepts**:
- `@RestController`: Combines `@Controller` + `@ResponseBody`
- Spring Boot serializes DTOs to JSON automatically
- `ResponseEntity` allows setting HTTP status codes

### Pathfinding Algorithm

The most interesting backend feature is graph pathfinding using PostgreSQL recursive CTEs:

**File**: [PathfindingService.java](backend/src/main/java/com/vasomap/service/PathfindingService.java:1)

```sql
WITH RECURSIVE vessel_path AS (
    -- Base case: edges from source
    SELECT child_id, ARRAY[source_id, child_id] as path, 1 as depth
    FROM vessel_edges WHERE parent_id = :sourceId

    UNION ALL

    -- Recursive case: extend paths
    SELECT e.child_id, vp.path || e.child_id, vp.depth + 1
    FROM vessel_edges e
    JOIN vessel_path vp ON e.parent_id = vp.vessel_id
    WHERE NOT e.child_id = ANY(vp.path)  -- Prevent cycles
      AND vp.depth < 20                   -- Limit depth
)
SELECT path FROM vessel_path WHERE vessel_id = :targetId
ORDER BY depth LIMIT 1;
```

**Why recursive CTEs?**
- Performs graph traversal in SQL (faster than application code)
- Breadth-first search ensures shortest path
- PostgreSQL optimizes recursive queries efficiently

---

## Frontend Deep Dive

### React + TypeScript Architecture

#### 1. State Management with Zustand

**File**: [mapStore.ts](frontend/src/store/mapStore.ts:1)

**Why Zustand?**
- Simpler than Redux (less boilerplate)
- No providers needed
- Excellent TypeScript support

```typescript
export const useMapStore = create<MapState>((set) => ({
    vessels: [],
    selectedVessel: null,
    setSelectedVessel: (vessel) => set({ selectedVessel: vessel }),
}));
```

**Usage in Components**:
```typescript
const { selectedVessel, setSelectedVessel } = useMapStore();
```

#### 2. API Layer

**File**: [api.ts](frontend/src/services/api.ts:1)

**Design**: Centralized API client with error handling

```typescript
async function fetchApi<T>(url: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${url}`, options);
    if (!response.ok) {
        throw new ApiError(/* ... */);
    }
    return response.json();
}
```

**Benefits**:
- Single place to configure base URL
- Type-safe responses with TypeScript generics
- Consistent error handling

#### 3. D3.js Force-Directed Graph

**File**: [VesselGraph.tsx](frontend/src/components/MapView/VesselGraph.tsx:1)

**Why D3.js?**
- Industry standard for data visualization
- Force simulation creates organic, readable layouts
- Fine-grained control over rendering

**Key Concepts**:

```typescript
const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).distance(100))    // Keep connected nodes close
    .force('charge', d3.forceManyBody().strength(-300))  // Repel all nodes
    .force('center', d3.forceCenter(w/2, h/2))           // Center the graph
    .force('collision', d3.forceCollide().radius(30));   // Prevent overlap
```

**React Integration**:
- D3 manipulates DOM directly (imperative)
- React manages component lifecycle (declarative)
- Use `useRef` to give D3 direct SVG access
- Use `useEffect` to synchronize D3 with React state

---

## Database Design

### Graph Data Model

VasoMap models the vascular system as a **directed graph**:

- **Nodes**: Vessels (arteries, veins, capillaries)
- **Edges**: Connections between vessels (parent → child)

**Why a graph?**
- Blood flows in specific directions
- Vessels branch and merge (tree + DAG structure)
- Graph algorithms (pathfinding, neighbor queries) are natural

### Schema Design Decisions

#### 1. Separate Edges Table

**Instead of**: Storing neighbors in a JSON column

**We use**: Normalized `vessel_edges` table

**Benefits**:
- Query performance (indexed lookups)
- Data integrity (foreign key constraints)
- Standard SQL graph queries

#### 2. Aliases in Separate Table

**Instead of**: `aliases TEXT[]` array column

**We use**: Normalized `aliases` table

**Benefits**:
- Easy to search (index on `alias` column)
- Add/remove aliases without updating vessel
- Supports multiple languages (future)

#### 3. Enum Types

**Example**: `CREATE TYPE vessel_type AS ENUM ('ARTERY', 'VEIN', 'CAPILLARY')`

**Benefits**:
- Type safety at database level
- Clear documentation of valid values
- Better than `VARCHAR` with CHECK constraint

---

## Key Algorithms

### 1. Breadth-First Search (Pathfinding)

**Implementation**: PostgreSQL recursive CTE

**Time Complexity**: O(V + E) where V = vessels, E = edges

**Space Complexity**: O(V) for path storage

### 2. Force-Directed Layout

**Implementation**: D3.js force simulation

**Algorithm**: Iterative physics simulation
- Attraction: Connected nodes pull together
- Repulsion: All nodes push apart
- Center: Gravity toward canvas center

**Convergence**: Stops when system reaches equilibrium

---

## Design Patterns

### Backend Patterns

#### 1. Repository Pattern
- Abstracts data access
- Enables switching databases without changing business logic

#### 2. DTO Pattern
- Separates internal entities from API contracts
- Prevents exposing sensitive data
- Allows API versioning

#### 3. Service Layer Pattern
- Encapsulates business logic
- Manages transactions
- Coordinates multiple repositories

### Frontend Patterns

#### 1. Container/Presentation Pattern
- **Containers**: Handle logic and state (e.g., `MapCanvas`)
- **Presentations**: Pure UI (e.g., `Button`, `Card`)

#### 2. Custom Hooks Pattern
- Encapsulate reusable logic
- Example: `useVessels()`, `useSelectedVessel()`

#### 3. Composition Pattern
- Build complex UIs from simple components
- Example: `VesselDetail` uses `Card`, `Button`

---

## Testing Strategy

### Backend Tests

#### Unit Tests
- **Tool**: JUnit 5 + Mockito
- **Focus**: Service logic in isolation
- **Example**: [VesselServiceTest.java](backend/src/test/java/com/vasomap/VesselServiceTest.java:1)

#### Integration Tests
- **Tool**: Testcontainers
- **Focus**: Database queries and pathfinding
- **Example**: [PathfindingServiceTest.java](backend/src/test/java/com/vasomap/PathfindingServiceTest.java:1)

**Why Testcontainers?**
- Real PostgreSQL instance (not H2/in-memory)
- Tests match production environment
- Automated setup/teardown

### Frontend Tests

#### Component Tests
- **Tool**: Vitest + React Testing Library
- **Focus**: Component behavior
- **Example**: [Button.test.tsx](frontend/src/components/ui/Button.test.tsx:1)

**Philosophy**: Test user interactions, not implementation details

---

## Learning Path

### Beginner Track

1. **Understand the Stack**: Install and run locally
2. **Read Database Schema**: [V1__initial_schema.sql](backend/src/main/resources/db/migration/V1__initial_schema.sql:1)
3. **Trace a Request**: Follow search query from UI to database and back
4. **Modify UI**: Change colors or add a new field

### Intermediate Track

1. **Add New Endpoint**: Create `GET /vessels/{id}/notes`
2. **Extend Frontend**: Display notes in `VesselDetail`
3. **Write Tests**: Add unit and component tests
4. **Improve Pathfinding**: Support multiple path algorithms

### Advanced Track

1. **Add Venous System**: New seed data and edge connections
2. **Implement 3D Visualization**: Replace D3 with Three.js
3. **Optimize Performance**: Add caching, pagination, lazy loading
4. **Deploy to Cloud**: AWS/GCP with Terraform

---

## Common Questions

### Q: Why not GraphQL instead of REST?

**A**: REST is simpler for MVP. GraphQL benefits (avoiding over-fetching) are less important when we control both frontend and backend. Future versions may add GraphQL.

### Q: Why PostgreSQL instead of Neo4j?

**A**: PostgreSQL's recursive CTEs handle graph queries well for our scale. Neo4j would be better for >100K vessels, but adds complexity for MVP.

### Q: Why D3.js instead of a React graphing library?

**A**: D3 gives maximum control and is industry-standard. React wrappers (like react-force-graph) limit customization. Worth the learning curve.

### Q: Why Zustand instead of Context API?

**A**: Context causes unnecessary re-renders. Zustand's selector pattern optimizes performance. Redux would work but has more boilerplate.

---

## Resources for Learning

### Backend
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [JPA/Hibernate Guide](https://www.baeldung.com/learn-jpa-hibernate)
- [PostgreSQL Recursive Queries](https://www.postgresql.org/docs/current/queries-with.html)

### Frontend
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [D3.js Force Simulation](https://d3js.org/d3-force)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

### Testing
- [Testing Library Principles](https://testing-library.com/docs/guiding-principles/)
- [Testcontainers](https://www.testcontainers.org/)

---

**Happy Learning! 🎓**
