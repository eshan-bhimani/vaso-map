-- VasoMap Initial Schema
-- Educational note: This migration creates the database schema for the vascular system.
-- Flyway executes migrations in version order (V1, V2, etc.) and tracks which have been applied.

-- Create custom enum types for type-safe constraints
CREATE TYPE vessel_type AS ENUM ('ARTERY', 'VEIN', 'CAPILLARY');
CREATE TYPE oxygenation AS ENUM ('OXYGENATED', 'DEOXYGENATED', 'MIXED');
CREATE TYPE flow_direction AS ENUM ('FORWARD', 'REVERSE');

-- Regions table: Hierarchical anatomical regions
CREATE TABLE regions (
	id BIGSERIAL PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	parent_id BIGINT REFERENCES regions(id) ON DELETE CASCADE,
	description TEXT,
	UNIQUE(name, parent_id)  -- Prevent duplicate region names at the same level
);

CREATE INDEX idx_region_parent ON regions(parent_id);

-- Vessels table: Blood vessels with their properties
CREATE TABLE vessels (
	id BIGSERIAL PRIMARY KEY,
	name VARCHAR(255) NOT NULL UNIQUE,  -- Each vessel has a unique primary name
	type vessel_type NOT NULL,
	oxygenation oxygenation NOT NULL,
	diameter_min_mm DECIMAL(5,2),  -- Minimum diameter in millimeters
	diameter_max_mm DECIMAL(5,2),  -- Maximum diameter in millimeters
	description TEXT,  -- Anatomical and functional description
	clinical_notes TEXT,  -- Clinical significance and pathology
	region_id BIGINT REFERENCES regions(id) ON DELETE SET NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for efficient vessel queries
CREATE INDEX idx_vessel_name ON vessels(name);
CREATE INDEX idx_vessel_type ON vessels(type);
CREATE INDEX idx_vessel_region ON vessels(region_id);

-- Vessel edges table: Directed connections between vessels
CREATE TABLE vessel_edges (
	id BIGSERIAL PRIMARY KEY,
	parent_id BIGINT NOT NULL REFERENCES vessels(id) ON DELETE CASCADE,
	child_id BIGINT NOT NULL REFERENCES vessels(id) ON DELETE CASCADE,
	flow_direction flow_direction NOT NULL,
	label VARCHAR(100),  -- Optional description of the branch (e.g., "first diagonal")
	UNIQUE(parent_id, child_id)  -- Prevent duplicate edges
);

-- Indexes for efficient graph traversal
CREATE INDEX idx_edges_parent ON vessel_edges(parent_id);
CREATE INDEX idx_edges_child ON vessel_edges(child_id);

-- Aliases table: Alternative names for vessels
CREATE TABLE aliases (
	id BIGSERIAL PRIMARY KEY,
	vessel_id BIGINT NOT NULL REFERENCES vessels(id) ON DELETE CASCADE,
	alias VARCHAR(255) NOT NULL,
	UNIQUE(vessel_id, alias)  -- Prevent duplicate aliases for the same vessel
);

CREATE INDEX idx_alias_vessel ON aliases(vessel_id);
CREATE INDEX idx_alias_alias ON aliases(alias);

-- Notes table: Educational content about vessels
CREATE TABLE notes (
	id BIGSERIAL PRIMARY KEY,
	vessel_id BIGINT NOT NULL REFERENCES vessels(id) ON DELETE CASCADE,
	title VARCHAR(200) NOT NULL,
	markdown TEXT NOT NULL,  -- Markdown-formatted content
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_note_vessel ON notes(vessel_id);

-- Trigger to update updated_at timestamp on vessels
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
	NEW.updated_at = CURRENT_TIMESTAMP;
	RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_vessels_updated_at
	BEFORE UPDATE ON vessels
	FOR EACH ROW
	EXECUTE FUNCTION update_updated_at_column();
