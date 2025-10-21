# VasoMap API Documentation

Complete REST API reference for VasoMap backend.

**Base URL**: `http://localhost:8080/api/v1`

**Interactive Documentation**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

---

## Table of Contents

1. [Vessels API](#vessels-api)
2. [Pathfinding API](#pathfinding-api)
3. [Regions API](#regions-api)
4. [Error Responses](#error-responses)

---

## Vessels API

### Get All Vessels

Retrieve all vessels, optionally filtered by search query.

**Endpoint**: `GET /vessels`

**Query Parameters**:
- `query` (optional): Search term to filter by name or alias

**Response**: `200 OK`

```json
[
  {
    "id": 3,
    "name": "Left Anterior Descending Artery",
    "type": "ARTERY",
    "oxygenation": "OXYGENATED",
    "region": "Heart",
    "aliases": ["LAD", "Anterior Interventricular Artery", "Widow Maker"]
  }
]
```

**Examples**:

```bash
# Get all vessels
curl http://localhost:8080/api/v1/vessels

# Search for "LAD"
curl "http://localhost:8080/api/v1/vessels?query=LAD"

# Search for "coronary"
curl "http://localhost:8080/api/v1/vessels?query=coronary"
```

---

### Get Vessel by ID

Retrieve detailed information about a specific vessel.

**Endpoint**: `GET /vessels/{id}`

**Path Parameters**:
- `id`: Vessel ID (integer)

**Response**: `200 OK`

```json
{
  "id": 3,
  "name": "Left Anterior Descending Artery",
  "type": "ARTERY",
  "oxygenation": "OXYGENATED",
  "diameterMinMm": 3.00,
  "diameterMaxMm": 4.00,
  "description": "Travels down the anterior interventricular sulcus toward the apex of the heart...",
  "clinicalNotes": "The most commonly occluded coronary artery in myocardial infarction...",
  "region": {
    "id": 1,
    "name": "Heart",
    "description": "The muscular organ that pumps blood..."
  },
  "aliases": ["LAD", "Anterior Interventricular Artery"],
  "upstreamNeighbors": [
    {
      "id": 2,
      "name": "Left Coronary Artery",
      "type": "ARTERY"
    }
  ],
  "downstreamNeighbors": [
    {
      "id": 4,
      "name": "First Diagonal Branch",
      "type": "ARTERY"
    },
    {
      "id": 6,
      "name": "First Septal Branch",
      "type": "ARTERY"
    }
  ]
}
```

**Examples**:

```bash
# Get vessel with ID 3 (LAD)
curl http://localhost:8080/api/v1/vessels/3

# With formatted JSON output
curl http://localhost:8080/api/v1/vessels/3 | jq
```

**Error Response**: `404 Not Found` if vessel doesn't exist

```json
{
  "timestamp": "2025-10-19T12:00:00",
  "status": 404,
  "error": "Not Found",
  "message": "Vessel with id 999 not found",
  "path": "/api/v1/vessels/999"
}
```

---

## Pathfinding API

### Find Path Between Vessels

Find the shortest path between two vessels.

**Endpoint**: `POST /paths`

**Request Body**:

```json
{
  "sourceId": 1,
  "targetId": 3
}
```

**Response**: `200 OK`

```json
{
  "path": [
    {
      "id": 1,
      "name": "Ascending Aorta",
      "type": "ARTERY"
    },
    {
      "id": 2,
      "name": "Left Coronary Artery",
      "type": "ARTERY"
    },
    {
      "id": 3,
      "name": "Left Anterior Descending Artery",
      "type": "ARTERY"
    }
  ],
  "pathLength": 3
}
```

**Examples**:

```bash
# Find path from Aorta (1) to LAD (3)
curl -X POST http://localhost:8080/api/v1/paths \
  -H "Content-Type: application/json" \
  -d '{"sourceId": 1, "targetId": 3}'

# Find path from Aorta (1) to PDA (14)
curl -X POST http://localhost:8080/api/v1/paths \
  -H "Content-Type: application/json" \
  -d '{"sourceId": 1, "targetId": 14}'
```

**Error Responses**:

**400 Bad Request** - Invalid request body

```json
{
  "timestamp": "2025-10-19T12:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed: sourceId: must not be null",
  "path": "/api/v1/paths"
}
```

**404 Not Found** - Vessel not found or no path exists

```json
{
  "timestamp": "2025-10-19T12:00:00",
  "status": 404,
  "error": "Not Found",
  "message": "No path found from vessel 'LAD' to vessel 'Disconnected Vessel'",
  "path": "/api/v1/paths"
}
```

---

## Regions API

### Get All Regions

Retrieve all anatomical regions in hierarchical tree structure.

**Endpoint**: `GET /regions`

**Response**: `200 OK`

```json
[
  {
    "id": 1,
    "name": "Heart",
    "parentId": null,
    "description": "The muscular organ that pumps blood throughout the body",
    "children": []
  },
  {
    "id": 2,
    "name": "Thorax",
    "parentId": null,
    "description": "The chest region containing the heart and lungs",
    "children": []
  }
]
```

**Examples**:

```bash
# Get all regions
curl http://localhost:8080/api/v1/regions

# With formatted output
curl http://localhost:8080/api/v1/regions | jq
```

---

## Error Responses

All error responses follow a consistent format:

```json
{
  "timestamp": "2025-10-19T12:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Detailed error message",
  "path": "/api/v1/endpoint"
}
```

### HTTP Status Codes

| Code | Meaning | When It Occurs |
|------|---------|----------------|
| 200  | OK | Request succeeded |
| 400  | Bad Request | Invalid request body or parameters |
| 404  | Not Found | Resource doesn't exist |
| 500  | Internal Server Error | Unexpected server error |

### Common Error Scenarios

#### 1. Vessel Not Found

**Request**: `GET /vessels/999`

**Response**: `404 Not Found`

```json
{
  "timestamp": "2025-10-19T12:00:00",
  "status": 404,
  "error": "Not Found",
  "message": "Vessel with id 999 not found",
  "path": "/api/v1/vessels/999"
}
```

#### 2. Missing Required Field

**Request**: `POST /paths` with empty body

**Response**: `400 Bad Request`

```json
{
  "timestamp": "2025-10-19T12:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed: sourceId: must not be null, targetId: must not be null",
  "path": "/api/v1/paths"
}
```

#### 3. No Path Exists

**Request**: `POST /paths` with disconnected vessels

**Response**: `404 Not Found`

```json
{
  "timestamp": "2025-10-19T12:00:00",
  "status": 404,
  "error": "Not Found",
  "message": "No path found from vessel 'Aorta' to vessel 'Isolated Vessel'",
  "path": "/api/v1/paths"
}
```

---

## Data Models

### VesselDTO

Basic vessel information for lists and search results.

```typescript
interface VesselDTO {
  id: number;
  name: string;
  type: 'ARTERY' | 'VEIN' | 'CAPILLARY';
  oxygenation: 'OXYGENATED' | 'DEOXYGENATED' | 'MIXED';
  region: string | null;
  aliases: string[];
}
```

### VesselDetailDTO

Detailed vessel information including neighbors.

```typescript
interface VesselDetailDTO {
  id: number;
  name: string;
  type: 'ARTERY' | 'VEIN' | 'CAPILLARY';
  oxygenation: 'OXYGENATED' | 'DEOXYGENATED' | 'MIXED';
  diameterMinMm: number | null;
  diameterMaxMm: number | null;
  description: string | null;
  clinicalNotes: string | null;
  region: RegionDTO | null;
  aliases: string[];
  upstreamNeighbors: VesselNeighborDTO[];
  downstreamNeighbors: VesselNeighborDTO[];
}
```

### PathResponseDTO

Pathfinding result with ordered vessel list.

```typescript
interface PathResponseDTO {
  path: PathVesselDTO[];
  pathLength: number;
}

interface PathVesselDTO {
  id: number;
  name: string;
  type: 'ARTERY' | 'VEIN' | 'CAPILLARY';
}
```

### RegionDTO

Anatomical region with hierarchical structure.

```typescript
interface RegionDTO {
  id: number;
  name: string;
  parentId: number | null;
  description: string | null;
  children: RegionDTO[];
}
```

---

## Rate Limiting

**Current Status**: No rate limiting (MVP)

**Future**: 100 requests/minute per IP

---

## Authentication

**Current Status**: No authentication required (MVP)

**Future**: JWT-based authentication for user features (bookmarks, annotations)

---

## CORS

The API allows requests from:
- `http://localhost:5173` (development frontend)

In production, this will be restricted to the deployed frontend domain.

---

## Versioning

API version is included in the URL: `/api/v1`

Breaking changes will increment the version: `/api/v2`

---

## Examples with Different Tools

### cURL

```bash
# Get all vessels
curl http://localhost:8080/api/v1/vessels

# Get vessel by ID
curl http://localhost:8080/api/v1/vessels/3

# Find path
curl -X POST http://localhost:8080/api/v1/paths \
  -H "Content-Type: application/json" \
  -d '{"sourceId": 1, "targetId": 3}'
```

### JavaScript (Fetch API)

```javascript
// Get all vessels
const vessels = await fetch('http://localhost:8080/api/v1/vessels')
  .then(res => res.json());

// Get vessel by ID
const vessel = await fetch('http://localhost:8080/api/v1/vessels/3')
  .then(res => res.json());

// Find path
const path = await fetch('http://localhost:8080/api/v1/paths', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ sourceId: 1, targetId: 3 })
}).then(res => res.json());
```

### Python (requests)

```python
import requests

# Get all vessels
vessels = requests.get('http://localhost:8080/api/v1/vessels').json()

# Get vessel by ID
vessel = requests.get('http://localhost:8080/api/v1/vessels/3').json()

# Find path
path = requests.post('http://localhost:8080/api/v1/paths', json={
    'sourceId': 1,
    'targetId': 3
}).json()
```

---

## Support

- **Swagger UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **Issues**: [GitHub Issues](https://github.com/yourusername/vasomap/issues)
- **Email**: api-support@vasomap.com

---

**Last Updated**: 2025-10-19
