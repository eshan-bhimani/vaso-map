/**
 * VesselGraph component - D3.js force-directed graph visualization.
 *
 * Educational note: This component creates an interactive force-directed graph where:
 * - Vessels are nodes (circles)
 * - Connections are edges (lines with arrows)
 * - Forces (gravity, repulsion, links) position nodes organically
 * - Users can pan, zoom, and drag nodes
 *
 * D3.js is used for the simulation and rendering, while React manages the component lifecycle.
 */

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useMapStore } from '../../store/mapStore';
import { api } from '../../services/api';
import {
  getVesselTypeColor,
  SELECTED_COLOR,
  PATH_HIGHLIGHT_COLOR,
  isVesselInPath,
  isEdgeInPath,
} from '../../utils/graphUtils';
import type { GraphNode, GraphLink, VesselEdge } from '../../types/vessel';

export function VesselGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  const {
    vessels,
    edges,
    setVessels,
    setEdges,
    selectedVessel,
    setSelectedVessel,
    pathHighlight,
    setIsLoading,
    setError,
  } = useMapStore();

  // Load vessels on mount
  useEffect(() => {
    loadVessels();
  }, []);

  async function loadVessels() {
    setIsLoading(true);
    setError(null);

    try {
      // Load all vessels
      const allVessels = await api.vessels.getAll();
      setVessels(allVessels);

      // Build edges from vessel connections
      // We need to fetch details for each vessel to get connections
      const edgesMap = new Map<string, VesselEdge>();

      for (const vessel of allVessels) {
        const details = await api.vessels.getById(vessel.id);

        // Create edges from downstream neighbors
        details.downstreamNeighbors.forEach((neighbor) => {
          const edgeId = `${vessel.id}-${neighbor.id}`;
          if (!edgesMap.has(edgeId)) {
            edgesMap.set(edgeId, {
              id: edgeId,
              source: vessel.id,
              target: neighbor.id,
            });
          }
        });
      }

      setEdges(Array.from(edgesMap.values()));
    } catch (error: any) {
      setError(error.message || 'Failed to load vessels');
    } finally {
      setIsLoading(false);
    }
  }

  // Update dimensions on window resize
  useEffect(() => {
    function handleResize() {
      if (svgRef.current) {
        const parent = svgRef.current.parentElement;
        if (parent) {
          setDimensions({
            width: parent.clientWidth,
            height: parent.clientHeight,
          });
        }
      }
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Create and update D3 visualization
  useEffect(() => {
    if (!svgRef.current || vessels.length === 0) return;

    const svg = d3.select(svgRef.current);
    const { width, height } = dimensions;

    // Clear previous content
    svg.selectAll('*').remove();

    // Create container for pan/zoom
    const g = svg.append('g');

    // Set up zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom as any);

    // Prepare nodes and links for D3
    const nodes: GraphNode[] = vessels.map((v) => ({ ...v }));
    const links: GraphLink[] = edges.map((e) => ({ ...e }));

    // Create force simulation
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        'link',
        d3
          .forceLink(links)
          .id((d: any) => d.id)
          .distance(100)
      )
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(30));

    // Create arrow markers for edge direction
    svg
      .append('defs')
      .selectAll('marker')
      .data(['arrow'])
      .join('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 20)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#999');

    // Create edges
    const link = g
      .append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', (d: any) =>
        isEdgeInPath(Number(d.source.id || d.source), Number(d.target.id || d.target), pathHighlight)
          ? PATH_HIGHLIGHT_COLOR
          : '#999'
      )
      .attr('stroke-width', (d: any) =>
        isEdgeInPath(Number(d.source.id || d.source), Number(d.target.id || d.target), pathHighlight)
          ? 3
          : 1.5
      )
      .attr('stroke-opacity', 0.6)
      .attr('marker-end', 'url(#arrow)');

    // Create node groups
    const node = g
      .append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .call(
        d3
          .drag<SVGGElement, GraphNode>()
          .on('start', dragStarted)
          .on('drag', dragged)
          .on('end', dragEnded) as any
      );

    // Add circles for nodes
    node
      .append('circle')
      .attr('r', 12)
      .attr('fill', (d) => {
        if (selectedVessel && d.id === selectedVessel.id) {
          return SELECTED_COLOR;
        }
        if (isVesselInPath(d.id, pathHighlight)) {
          return PATH_HIGHLIGHT_COLOR;
        }
        return getVesselTypeColor(d.type);
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer');

    // Add labels
    node
      .append('text')
      .text((d) => d.aliases[0] || d.name)
      .attr('x', 16)
      .attr('y', 4)
      .style('font-size', '12px')
      .style('font-family', 'sans-serif')
      .style('fill', '#333')
      .style('pointer-events', 'none');

    // Add tooltips
    node.append('title').text((d) => `${d.name}\n${d.type} • ${d.region || 'Unknown region'}`);

    // Handle node clicks
    node.on('click', async (event, d) => {
      event.stopPropagation();
      setIsLoading(true);

      try {
        const details = await api.vessels.getById(d.id);
        setSelectedVessel(details);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    });

    // Update positions on each tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragStarted(event: any, d: GraphNode) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: GraphNode) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragEnded(event: any, d: GraphNode) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [vessels, edges, dimensions, selectedVessel, pathHighlight]);

  return (
    <svg
      ref={svgRef}
      width={dimensions.width}
      height={dimensions.height}
      className="bg-gray-50"
    />
  );
}
