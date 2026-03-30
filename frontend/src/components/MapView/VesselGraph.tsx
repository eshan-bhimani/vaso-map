import { useEffect, useRef } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const nodePositionsRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const rafRef = useRef<number | null>(null);

  const {
    vessels,
    edges,
    setVessels,
    setEdges,
    selectedVessel,
    setSelectedVessel,
    pathHighlight,
    simulateFlow,
    setIsLoading,
    setError,
  } = useMapStore();

  /* ── Load vessels on mount ── */
  useEffect(() => {
    loadVessels();
  }, []);

  async function loadVessels() {
    setIsLoading(true);
    setError(null);
    try {
      const allVessels = await api.vessels.getAll();
      setVessels(allVessels);

      const edgesMap = new Map<string, VesselEdge>();
      for (const vessel of allVessels) {
        const details = await api.vessels.getById(vessel.id);
        details.downstreamNeighbors.forEach((neighbor) => {
          const edgeId = `${vessel.id}-${neighbor.id}`;
          if (!edgesMap.has(edgeId)) {
            edgesMap.set(edgeId, { id: edgeId, source: vessel.id, target: neighbor.id });
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

  /* ── Main D3 graph ── */
  useEffect(() => {
    if (!svgRef.current || !containerRef.current || vessels.length === 0) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const svg = d3.select(svgRef.current);

    svg.attr('width', width).attr('height', height);
    svg.selectAll('*').remove();

    /* ── Defs: glow filters + arrow markers ── */
    const defs = svg.append('defs');

    // Glow filter factory
    const createGlow = (id: string, color: string) => {
      const f = defs.append('filter').attr('id', id).attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
      f.append('feColorMatrix').attr('type', 'matrix').attr('values', `0 0 0 0 ${hexToRgbNorm(color, 0)} 0 0 0 0 ${hexToRgbNorm(color, 1)} 0 0 0 0 ${hexToRgbNorm(color, 2)} 0 0 0 1.2 0`).attr('result', 'colorized');
      const blur = f.append('feGaussianBlur').attr('in', 'colorized').attr('stdDeviation', '5').attr('result', 'blurred');
      const merge = f.append('feMerge');
      merge.append('feMergeNode').attr('in', 'blurred');
      merge.append('feMergeNode').attr('in', 'SourceGraphic');
    };

    createGlow('glow-artery',    '#e11d48');
    createGlow('glow-vein',      '#2563eb');
    createGlow('glow-capillary', '#7c3aed');
    createGlow('glow-selected',  '#f59e0b');
    createGlow('glow-path',      '#22d3ee');

    // Arrow marker
    const mkArrow = (id: string, color: string) => {
      defs.append('marker')
        .attr('id', id)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 22)
        .attr('refY', 0)
        .attr('markerWidth', 5)
        .attr('markerHeight', 5)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', color)
        .attr('opacity', 0.8);
    };
    mkArrow('arrow-default', 'rgba(255,255,255,0.25)');
    mkArrow('arrow-path',    PATH_HIGHLIGHT_COLOR);

    /* ── Zoom setup ── */
    const g = svg.append('g').attr('class', 'graph-container');

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 5])
      .on('zoom', (e) => g.attr('transform', e.transform));
    svg.call(zoom as any);

    /* ── Build nodes + links ── */
    const nodes: GraphNode[] = vessels.map((v) => ({ ...v }));
    const links: GraphLink[] = edges.map((e) => ({ ...e }));

    /* ── Force simulation ── */
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(110).strength(0.7))
      .force('charge', d3.forceManyBody().strength(-380))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(26));

    /* ── Render edges ── */
    const link = g.append('g').selectAll<SVGLineElement, GraphLink>('line')
      .data(links)
      .join('line')
      .attr('class', (d: any) =>
        isEdgeInPath(getNodeId(d.source), getNodeId(d.target), pathHighlight)
          ? 'path-edge-animated'
          : ''
      )
      .attr('stroke', (d: any) =>
        isEdgeInPath(getNodeId(d.source), getNodeId(d.target), pathHighlight)
          ? PATH_HIGHLIGHT_COLOR
          : 'rgba(255,255,255,0.12)'
      )
      .attr('stroke-width', (d: any) =>
        isEdgeInPath(getNodeId(d.source), getNodeId(d.target), pathHighlight) ? 2.5 : 1
      )
      .attr('stroke-opacity', 1)
      .attr('marker-end', (d: any) =>
        isEdgeInPath(getNodeId(d.source), getNodeId(d.target), pathHighlight)
          ? 'url(#arrow-path)'
          : 'url(#arrow-default)'
      );

    /* ── Render node groups ── */
    const node = g.append('g').selectAll<SVGGElement, GraphNode>('g')
      .data(nodes)
      .join('g')
      .style('cursor', 'pointer')
      .call(
        d3.drag<SVGGElement, GraphNode>()
          .on('start', (e, d) => { if (!e.active) simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
          .on('drag',  (e, d) => { d.fx = e.x; d.fy = e.y; })
          .on('end',   (e, d) => { if (!e.active) simulation.alphaTarget(0); d.fx = null; d.fy = null; }) as any
      );

    // Glow halo ring (pulsing for selected/path nodes)
    node.append('circle')
      .attr('r', 18)
      .attr('fill', (d) => {
        if (selectedVessel && d.id === selectedVessel.id) return SELECTED_COLOR;
        if (isVesselInPath(d.id, pathHighlight)) return PATH_HIGHLIGHT_COLOR;
        return getVesselTypeColor(d.type);
      })
      .attr('opacity', (d) => {
        if (selectedVessel && d.id === selectedVessel.id) return 0.18;
        if (isVesselInPath(d.id, pathHighlight)) return 0.22;
        return 0.1;
      })
      .attr('filter', (d) => {
        if (selectedVessel && d.id === selectedVessel.id) return 'url(#glow-selected)';
        if (isVesselInPath(d.id, pathHighlight)) return 'url(#glow-path)';
        return `url(#glow-${d.type.toLowerCase()})`;
      });

    // Solid core circle
    node.append('circle')
      .attr('r', 11)
      .attr('fill', (d) => {
        if (selectedVessel && d.id === selectedVessel.id) return SELECTED_COLOR;
        if (isVesselInPath(d.id, pathHighlight)) return PATH_HIGHLIGHT_COLOR;
        return getVesselTypeColor(d.type);
      })
      .attr('stroke', (d) => {
        if (selectedVessel && d.id === selectedVessel.id) return '#fff';
        return 'rgba(255,255,255,0.3)';
      })
      .attr('stroke-width', (d) => (selectedVessel && d.id === selectedVessel.id ? 2 : 1))
      .attr('filter', (d) => {
        if (selectedVessel && d.id === selectedVessel.id) return 'url(#glow-selected)';
        if (isVesselInPath(d.id, pathHighlight)) return 'url(#glow-path)';
        return `url(#glow-${d.type.toLowerCase()})`;
      });

    // Label
    node.append('text')
      .text((d) => d.aliases[0] ?? d.name)
      .attr('x', 15)
      .attr('y', 4)
      .style('font-size', '11px')
      .style('font-family', 'Inter, sans-serif')
      .style('font-weight', '500')
      .style('fill', (d) => {
        if (selectedVessel && d.id === selectedVessel.id) return '#fbbf24';
        if (isVesselInPath(d.id, pathHighlight)) return '#22d3ee';
        return 'rgba(240,246,252,0.75)';
      })
      .style('pointer-events', 'none')
      .style('text-shadow', '0 1px 4px rgba(0,0,0,0.9)');

    // Click handler
    node.on('click', async (event, d) => {
      event.stopPropagation();
      setIsLoading(true);
      try {
        const details = await api.vessels.getById(d.id);
        setSelectedVessel(details);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    });

    /* ── Tick ── */
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);

      // Store positions for particle animation
      nodes.forEach((n) => {
        if (n.x !== undefined && n.y !== undefined) {
          nodePositionsRef.current.set(n.id, { x: n.x, y: n.y });
        }
      });
    });

    // Deselect on canvas click
    svg.on('click', () => setSelectedVessel(null));

    // Resize observer
    const ro = new ResizeObserver(() => {
      if (!container || !svgRef.current) return;
      svg.attr('width', container.clientWidth).attr('height', container.clientHeight);
      simulation.force('center', d3.forceCenter(container.clientWidth / 2, container.clientHeight / 2));
      simulation.alpha(0.2).restart();
    });
    ro.observe(container);

    return () => {
      simulation.stop();
      ro.disconnect();
    };
  }, [vessels, edges, selectedVessel, pathHighlight]);

  /* ── Particle flow RAF ── */
  useEffect(() => {
    if (!simulateFlow || pathHighlight.length < 2) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      // Remove particles
      if (svgRef.current) {
        d3.select(svgRef.current).selectAll('.flow-particle').remove();
      }
      return;
    }

    const svg = d3.select(svgRef.current);
    const g = svg.select('.graph-container');

    const particleCount = 3;
    const pathCount = pathHighlight.length - 1;

    // Build flat particle data
    const particleData: Array<{ edgeIdx: number; phaseOffset: number }> = [];
    for (let i = 0; i < pathCount; i++) {
      for (let j = 0; j < particleCount; j++) {
        particleData.push({ edgeIdx: i, phaseOffset: j / particleCount });
      }
    }

    g.selectAll('.flow-particle')
      .data(particleData)
      .join('circle')
      .attr('class', 'flow-particle')
      .attr('r', 4.5)
      .attr('fill', PATH_HIGHLIGHT_COLOR)
      .attr('opacity', 0.92)
      .attr('filter', 'url(#glow-path)')
      .style('pointer-events', 'none');

    let phase = 0;

    const animate = () => {
      phase = (phase + 0.006) % 1;

      g.selectAll<SVGCircleElement, { edgeIdx: number; phaseOffset: number }>('.flow-particle')
        .attr('cx', (d) => {
          const src = nodePositionsRef.current.get(pathHighlight[d.edgeIdx]);
          const tgt = nodePositionsRef.current.get(pathHighlight[d.edgeIdx + 1]);
          if (!src || !tgt) return 0;
          const t = (phase + d.phaseOffset) % 1;
          return src.x + (tgt.x - src.x) * t;
        })
        .attr('cy', (d) => {
          const src = nodePositionsRef.current.get(pathHighlight[d.edgeIdx]);
          const tgt = nodePositionsRef.current.get(pathHighlight[d.edgeIdx + 1]);
          if (!src || !tgt) return 0;
          const t = (phase + d.phaseOffset) % 1;
          return src.y + (tgt.y - src.y) * t;
        });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [simulateFlow, pathHighlight]);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <svg ref={svgRef} className="w-full h-full" style={{ background: 'transparent' }} />
    </div>
  );
}

/* ── Helpers ── */
function getNodeId(node: number | GraphNode): number {
  return typeof node === 'number' ? node : node.id;
}

function hexToRgbNorm(hex: string, channel: number): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '0';
  const vals = [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255,
  ];
  return vals[channel].toFixed(3);
}
